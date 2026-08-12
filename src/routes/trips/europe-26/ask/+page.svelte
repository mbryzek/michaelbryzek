<script lang="ts">
  import { page } from '$app/state';
  import { trip } from '$lib/trip/store.svelte';
  import { formatLong, focusDate, isValidTripDate } from '$lib/trip/dates';
  import { parseSuggestions, renderReply, stripSuggestions } from '$lib/trip/suggestions';
  import type { Suggestion } from '$lib/trip/types';

  interface Turn {
    role: 'user' | 'assistant';
    content: string;
    /** Which suggestions from this turn have already been saved. */
    saved: Set<number>;
  }

  const requested = $derived(page.url.searchParams.get('date') ?? '');
  const date = $derived(isValidTripDate(requested) ? requested : focusDate());
  const day = $derived(trip.trip.days.find((d) => d.date === date));

  let turns = $state<Turn[]>([]);
  let question = $state('');
  let thinking = $state(false);
  let chatError = $state<string | null>(null);
  let thread: HTMLElement | null = $state(null);

  /** Openers that fit whichever day is in focus, so the box is never blank. */
  const prompts = $derived([
    'What should we actually do this day?',
    day ? `Where should we eat in ${day.place.split(',')[0]}?` : 'Where should we eat?',
    'What is worth booking ahead, and when?',
    'Anything happening here that week?'
  ]);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      thread?.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' });
    });
  }

  async function ask(text: string) {
    const asked = text.trim();
    if (!asked || thinking) return;

    chatError = null;
    question = '';
    thinking = true;

    // History excludes the turn being asked — the server appends it.
    const history = turns.map((t) => ({ role: t.role, content: t.content }));
    turns = [...turns, { role: 'user', content: asked, saved: new Set() }, { role: 'assistant', content: '', saved: new Set() }];
    scrollToEnd();

    try {
      const response = await fetch('/trips/europe-26/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ date, question: asked, history })
      });

      if (!response.ok || !response.body) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message ?? `The assistant is unavailable (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Reassign the array so the rune notices; mutating the last element in
        // place would render the first token and then nothing.
        turns = turns.map((t, i) => (i === turns.length - 1 ? { ...t, content: buffer } : t));
        scrollToEnd();
      }
    } catch (err) {
      chatError = err instanceof Error ? err.message : 'Could not reach the assistant';
      // Drop the empty assistant turn so a retry does not stack blank bubbles.
      turns = turns.filter((t, i) => !(i === turns.length - 1 && t.content === ''));
    } finally {
      thinking = false;
    }
  }

  async function save(turnIndex: number, suggestionIndex: number, suggestion: Suggestion) {
    const sourceQ = turns[turnIndex - 1]?.content ?? '';
    try {
      await trip.saveIdea({
        date,
        title: suggestion.title,
        detail: suggestion.detail,
        sourceQ
      });
      turns = turns.map((t, i) => (i === turnIndex ? { ...t, saved: new Set([...t.saved, suggestionIndex]) } : t));
    } catch (err) {
      chatError = err instanceof Error ? err.message : 'Could not save that';
    }
  }

  function submit(event: SubmitEvent) {
    event.preventDefault();
    ask(question);
  }
</script>

<h1 class="page-title">Ask</h1>
{#if day}
  <p class="page-subtitle">
    {formatLong(date)} · {day.place}
  </p>
{/if}

<div class="chat" bind:this={thread} style="margin-top:var(--space-5)">
  {#if turns.length === 0}
    <p class="empty" style="text-align:left">
      Ask about this day. The assistant already knows where you are, what's booked, and how long the transfers take — and it searches the
      web for anything that changes, like opening hours and ferry times.
    </p>
    <div class="save-row" style="border-top:0;padding-top:0">
      {#each prompts as prompt (prompt)}
        <button class="save-chip" onclick={() => ask(prompt)}>
          <span class="st">{prompt}</span>
          <span class="action">Ask</span>
        </button>
      {/each}
    </div>
  {/if}

  {#each turns as turn, turnIndex (turnIndex)}
    {#if turn.role === 'user'}
      <div class="bubble bubble--you">{turn.content}</div>
    {:else}
      {@const visible = stripSuggestions(turn.content)}
      {@const suggestions = parseSuggestions(turn.content)}
      <div class="bubble bubble--claude">
        {#if visible === ''}
          <p style="color:var(--text-subtle)">Thinking…</p>
        {:else}
          <!-- renderReply escapes every input before formatting; see suggestions.ts -->
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html renderReply(visible)}
        {/if}

        {#if suggestions.length > 0}
          <div class="save-row">
            {#each suggestions as suggestion, suggestionIndex (suggestion.title)}
              {@const isSaved = turn.saved.has(suggestionIndex)}
              <button class="save-chip" disabled={isSaved} onclick={() => save(turnIndex, suggestionIndex, suggestion)}>
                <span>
                  <span class="st">{suggestion.title}</span>
                  {#if suggestion.detail}
                    <span class="sd" style="display:block">{suggestion.detail}</span>
                  {/if}
                </span>
                <span class="action">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</div>

{#if chatError}
  <p class="trip-error" style="margin-top:var(--space-4)">{chatError}</p>
{/if}

<form class="composer" onsubmit={submit}>
  <label class="sr-only" for="ask">Ask about {formatLong(date)}</label>
  <textarea
    id="ask"
    class="field"
    bind:value={question}
    rows="2"
    placeholder="Ask about this day…"
    onkeydown={(event) => {
      // Enter sends, Shift+Enter breaks the line — the messaging convention,
      // and this is used one-handed on a phone more than at a keyboard.
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        ask(question);
      }
    }}></textarea>
  <button class="btn" type="submit" disabled={thinking || question.trim() === ''}>
    {thinking ? '…' : 'Ask'}
  </button>
</form>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
