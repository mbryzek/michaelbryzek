import Anthropic from '@anthropic-ai/sdk';
import type { Trip } from '$lib/trip/types';
import { formatLong } from '$lib/trip/dates';

/**
 * The trip assistant.
 *
 * Two things make this worth building rather than opening the Claude app: it
 * already knows where we are and what is booked, so no question needs a
 * paragraph of preamble; and it can search, so "is the market open Sunday"
 * has a real answer rather than a plausible one.
 */

const MODEL = 'claude-opus-5';

/**
 * Claude Opus 5 thinks by default and `max_tokens` caps thinking *plus* the
 * reply, so this needs headroom well past the visible answer length. Streaming
 * means the large ceiling costs nothing when the reply is short.
 */
const MAX_TOKENS = 16_000;

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * The itinerary, rendered once per request and placed behind a cache
 * breakpoint. Opus 5 caches from 512 tokens, so this is read at roughly a tenth
 * of input cost on every message after the first — which is what keeps the
 * whole trip in the range of a nice lunch rather than a monthly bill.
 *
 * Deliberately stable: no timestamps, no per-request ids, nothing that would
 * change the bytes and invalidate the prefix.
 */
export function renderItinerary(trip: Trip): string {
  const lines: string[] = [
    'ITINERARY — Mike and Lisa, 9 September to 3 October 2026.',
    'Italy (Lake Como, Amalfi Coast), Greece (Crete, Paros), then Porto.',
    ''
  ];

  for (const day of trip.days) {
    lines.push(`## ${formatLong(day.date)} (${day.date}) — ${day.place}, ${day.country}`);
    if (day.summary) lines.push(day.summary);
    if (day.lodging) lines.push(`Sleeping: ${day.lodging}`);

    const items = trip.items.filter((i) => i.date === day.date);
    for (const item of items) {
      const time = item.startTime ? `${item.startTime} ` : '';
      const status = item.confirmed ? 'BOOKED' : 'planned';
      lines.push(`- [${status}] ${time}${item.kind}: ${item.title}${item.detail ? ` — ${item.detail}` : ''}`);
    }

    const ideas = trip.ideas.filter((i) => i.date === day.date && !i.promotedAt);
    for (const idea of ideas) {
      lines.push(`- [saved idea, not yet planned] ${idea.title}`);
    }

    const notes = trip.notes.filter((n) => n.date === day.date);
    for (const note of notes) {
      lines.push(`- [note from ${note.author}] ${note.body}`);
    }
    lines.push('');
  }

  const open = trip.questions.filter((q) => !q.resolvedAt);
  if (open.length > 0) {
    lines.push('STILL UNRESOLVED:');
    for (const q of open) lines.push(`- ${q.question}`);
  }

  return lines.join('\n');
}

function systemPrompt(focusDate: string, todayIso: string): string {
  return `You are helping Mike and Lisa with a trip through Italy, Greece, Poland and Portugal running 9 September to 3 October 2026. The full itinerary follows this instruction block.

Today is ${todayIso}. They are asking about ${formatLong(focusDate)}.

You already have the itinerary. Never ask where they are, what is booked, or how long they have — read it. Answer the question that was asked, at the scope it was asked.

Ground your answers in the trip as it actually is. A suggestion two hours' drive from where they are sleeping needs to say so. The Amalfi coast road is slow; the Greek islands run on ferries that do not always run. If something they are considering conflicts with a booking, say so plainly in a sentence.

Search the web when the answer turns on something current — opening hours, closures, ferry and train schedules, festivals, weather, whether a place still exists. Do not search for things that do not change.

Keep responses brief and focused. Lead with the answer. Put caveats after it, briefly. Most questions want a short paragraph or a handful of options, not an essay — they are reading this on a phone, sometimes on hotel wifi.

Be specific and concrete. Name the place, say roughly what it costs, say how long it takes to get there and how. "There are some nice beaches nearby" helps nobody; "Seitan Limania, 40 minutes east, steep walk down from the car park, go before 10am" does.

When you offer things they could actually do, end your reply with a fenced block tagged \`suggestions\` containing a JSON array, so they can save them with one tap:

\`\`\`suggestions
[{"title": "Seitan Limania beach", "detail": "40 min east of Chania. Steep 10 min descent. Arrive before 10am for parking."}]
\`\`\`

Include between one and five entries, each one a distinct thing they could do or book. Titles are short. Details carry the practical part — timing, cost, how to get there, what to know. Omit the block entirely when the question was not asking for options; a factual answer does not need one.`;
}

/**
 * A streaming reply, as plain text chunks.
 *
 * Server tools make this a loop rather than a single call: a turn that runs
 * several searches can come back `pause_turn`, meaning the server hit its
 * internal iteration cap and expects the conversation replayed to continue.
 * Without the loop that surfaces as an answer that stops mid-thought with no
 * error anywhere.
 */
export async function streamReply(opts: {
  apiKey: string;
  trip: Trip;
  focusDate: string;
  todayIso: string;
  history: ChatTurn[];
  question: string;
}): Promise<ReadableStream<Uint8Array>> {
  const client = new Anthropic({ apiKey: opts.apiKey });
  const encoder = new TextEncoder();

  const messages: Anthropic.MessageParam[] = [
    ...opts.history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: 'user' as const, content: opts.question }
  ];

  return new ReadableStream({
    async start(controller) {
      try {
        // Bounded so a pathological pause_turn cycle cannot bill forever.
        for (let attempt = 0; attempt < 5; attempt++) {
          const stream = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            output_config: { effort: 'medium' },
            system: [
              {
                type: 'text',
                text: systemPrompt(opts.focusDate, opts.todayIso)
              },
              {
                type: 'text',
                text: renderItinerary(opts.trip),
                // The cache breakpoint sits at the end of the itinerary: it is
                // the largest stable thing in the request, and everything
                // after it (the conversation) is what varies.
                cache_control: { type: 'ephemeral' }
              }
            ],
            tools: [
              // Dynamic-filtering web search: results are filtered server-side
              // before they reach the context window, which matters because a
              // ferry timetable page is mostly navigation furniture.
              { type: 'web_search_20260209', name: 'web_search', max_uses: 6 }
            ],
            messages
          });

          stream.on('text', (delta) => {
            controller.enqueue(encoder.encode(delta));
          });

          const message = await stream.finalMessage();

          if (message.stop_reason !== 'pause_turn') break;

          // Replay the paused turn verbatim; the server picks up where it
          // stopped. Adding a "continue" user message here would derail it.
          messages.push({ role: 'assistant', content: message.content });
        }
      } catch (err) {
        const detail = err instanceof Error ? err.message : 'unknown error';
        controller.enqueue(encoder.encode(`\n\n_Could not reach the assistant: ${detail}_`));
      } finally {
        controller.close();
      }
    }
  });
}
