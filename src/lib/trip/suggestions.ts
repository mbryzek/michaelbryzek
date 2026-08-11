import type { Suggestion } from './types';

/**
 * The assistant ends a reply with a fenced ```suggestions block holding a JSON
 * array, which the UI turns into one-tap save buttons.
 *
 * A fenced block rather than a custom marker for one reason: when anything goes
 * wrong — the model omits it, the JSON is half-written mid-stream, a future
 * model formats it differently — the failure is a missing row of buttons, not a
 * broken reply. The prose above the fence is always shown as-is.
 */

const FENCE = /```suggestions\s*([\s\S]*?)```/;

/** Everything before the fence: what the reader should actually see. */
export function stripSuggestions(reply: string): string {
  const opening = reply.indexOf('```suggestions');
  if (opening === -1) return reply.trimEnd();
  // Cut at the opening fence rather than at the matched pair, so a block still
  // arriving token by token is hidden the moment it starts rather than
  // flickering half-written JSON at the reader.
  return reply.slice(0, opening).trimEnd();
}

export function parseSuggestions(reply: string): Suggestion[] {
  const match = FENCE.exec(reply);
  if (!match) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[1].trim());
  } catch {
    // Truncated or malformed: show nothing rather than guessing at intent.
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
    .map((entry) => ({
      title: String(entry.title ?? '').trim(),
      detail: String(entry.detail ?? '').trim()
    }))
    .filter((s) => s.title !== '')
    .slice(0, 5);
}

/**
 * Minimal inline formatting for assistant replies: bold, italics, links, and
 * `code`. Everything is escaped first, so the output is safe to insert as HTML
 * — no markdown library, and no sanitiser to keep current.
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/** Paragraphs, bullet lists, and headings — the shapes replies actually use. */
export function renderReply(text: string): string {
  const blocks: string[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (line === '') {
      flushList();
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }

    const heading = /^#{1,4}\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      blocks.push(`<h4>${inline(heading[1])}</h4>`);
      continue;
    }

    flushList();
    blocks.push(`<p>${inline(line)}</p>`);
  }
  flushList();

  return blocks.join('');
}
