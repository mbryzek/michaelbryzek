<script lang="ts">
  import { page } from '$app/state';
  import { trip } from '$lib/trip/store.svelte';
  import { formatLong, isValidTripDate, relativeTime } from '$lib/trip/dates';

  const date = $derived(page.params.date ?? '');
  const valid = $derived(isValidTripDate(date));
  const day = $derived(trip.trip.days.find((d) => d.date === date));

  const items = $derived(trip.itemsOn(date));
  const booked = $derived(items.filter((i) => i.confirmed));
  const planned = $derived(items.filter((i) => !i.confirmed));
  const ideas = $derived(trip.ideasOn(date));
  const notes = $derived(trip.notesOn(date));

  let noteText = $state('');
  let saving = $state(false);
  let actionError = $state<string | null>(null);

  const index = $derived(trip.trip.days.findIndex((d) => d.date === date));
  const previous = $derived(index > 0 ? trip.trip.days[index - 1] : null);
  const next = $derived(index >= 0 && index < trip.trip.days.length - 1 ? trip.trip.days[index + 1] : null);

  async function run(action: () => Promise<void>) {
    actionError = null;
    try {
      await action();
    } catch (err) {
      actionError = err instanceof Error ? err.message : 'That did not work';
    }
  }

  async function postNote(event: SubmitEvent) {
    event.preventDefault();
    const body = noteText.trim();
    if (!body || saving) return;

    saving = true;
    // Clear optimistically so a slow connection does not invite a double post.
    noteText = '';
    await run(async () => {
      try {
        await trip.addNote(date, body);
      } catch (err) {
        noteText = body;
        throw err;
      }
    });
    saving = false;
  }
</script>

{#if !valid}
  <p class="empty">That date is not part of this trip.</p>
{:else if !day}
  <p class="empty">Loading…</p>
{:else}
  <h1 class="page-title">{formatLong(date)}</h1>
  <p class="page-subtitle">
    {day.place}{day.lodging ? ` · sleeping in ${day.lodging}` : ''}
  </p>

  {#if actionError}
    <p class="trip-error">{actionError}</p>
  {/if}

  {#if booked.length > 0}
    <section class="trip-section">
      <h2>Booked</h2>
      {#each booked as item (item.id)}
        <div class="card card--booked">
          <div class="row">
            <p class="title">{item.title}</p>
            {#if item.startTime}
              <span class="badge">{item.startTime}</span>
            {/if}
          </div>
          {#if item.detail}
            <p class="detail">{item.detail}</p>
          {/if}
          {#if item.cost || item.costNote}
            <div class="meta">
              {#if item.cost}<span>{item.cost}</span>{/if}
              {#if item.costNote}<span>{item.costNote}</span>{/if}
            </div>
          {/if}
        </div>
      {/each}
    </section>
  {/if}

  {#if planned.length > 0}
    <section class="trip-section">
      <h2>Planned</h2>
      {#each planned as item (item.id)}
        <div class="card card--planned">
          <div class="row">
            <p class="title">{item.title}</p>
            <button class="inline-btn" onclick={() => run(() => trip.deleteItem(item.id))} aria-label="Remove {item.title}">
              Remove
            </button>
          </div>
          {#if item.detail}
            <p class="detail">{item.detail}</p>
          {/if}
        </div>
      {/each}
    </section>
  {/if}

  {#if ideas.length > 0}
    <section class="trip-section">
      <h2>Ideas</h2>
      {#each ideas as idea (idea.id)}
        <div class="card card--idea">
          <div class="row">
            <p class="title">{idea.title}</p>
            <button class="inline-btn" onclick={() => run(() => trip.deleteIdea(idea.id))}> Discard </button>
          </div>
          {#if idea.detail}
            <p class="detail">{idea.detail}</p>
          {/if}
          <div class="meta">
            <span>saved by {idea.savedBy}</span>
            {#if idea.sourceQ}
              <span title={idea.sourceQ}>from “{idea.sourceQ.slice(0, 48)}…”</span>
            {/if}
          </div>
          <div style="margin-top:var(--space-3)">
            <button class="btn btn--secondary" onclick={() => run(() => trip.promoteIdea(idea.id))}> Add to the day </button>
          </div>
        </div>
      {/each}
    </section>
  {/if}

  <section class="trip-section">
    <h2>Notes</h2>
    {#if notes.length === 0}
      <p class="empty">Nothing yet. Leave a note for this day.</p>
    {:else}
      {#each notes as note (note.id)}
        <div class="note">
          <div class="byline">
            <span>{note.author} · {relativeTime(note.createdAt)}</span>
            {#if note.author === trip.name}
              <button class="inline-btn" onclick={() => run(() => trip.deleteNote(note.id))}>delete</button>
            {/if}
          </div>
          <p class="body">{note.body}</p>
        </div>
      {/each}
    {/if}

    <form class="composer" onsubmit={postNote}>
      <label class="sr-only" for="note">Add a note</label>
      <textarea id="note" class="field" bind:value={noteText} placeholder="Add a note for this day…" rows="2"></textarea>
      <button class="btn" type="submit" disabled={saving || noteText.trim() === ''}>Post</button>
    </form>
  </section>

  <section class="trip-section">
    <a class="btn btn--secondary" href="/trips/europe-26/ask?date={date}"> Ask about this day </a>
  </section>

  <nav class="trip-section day-list" aria-label="Nearby days">
    {#if previous}
      <a class="day-row" href="/trips/europe-26/days/{previous.date}">
        <span class="when">Back</span>
        <span
          ><p class="place">{previous.place}</p>
          <p class="sub">{formatLong(previous.date)}</p></span
        >
        <span class="marks"></span>
      </a>
    {/if}
    {#if next}
      <a class="day-row" href="/trips/europe-26/days/{next.date}">
        <span class="when">Next</span>
        <span
          ><p class="place">{next.place}</p>
          <p class="sub">{formatLong(next.date)}</p></span
        >
        <span class="marks"></span>
      </a>
    {/if}
  </nav>
{/if}

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
