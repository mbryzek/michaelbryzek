<script lang="ts">
  import { trip } from '$lib/trip/store.svelte';
  import { daysUntilDeparture, formatCompact, tripDayNumber, today, focusDate } from '$lib/trip/dates';
  import { TRIP_END } from '$lib/trip/types';

  const until = $derived(daysUntilDeparture());
  const dayNumber = $derived(tripDayNumber());
  const finished = $derived(today() > TRIP_END);

  /** The four legs, derived from the itinerary rather than hardcoded. */
  const legs = $derived.by(() => {
    const out: { country: string; from: string; to: string }[] = [];
    for (const day of trip.trip.days) {
      const last = out.at(-1);
      if (last && last.country === day.country) {
        last.to = day.date;
      } else {
        out.push({ country: day.country, from: day.date, to: day.date });
      }
    }
    // The outbound flight day is in the US; it is travel, not a leg.
    return out.filter((leg) => leg.country !== 'United States');
  });

  /**
   * The anticipation list: saved ideas and unbooked plans, newest first. This
   * is the part that should make opening the app on a Tuesday in August worth
   * it — it grows every time either of us asks a question and keeps an answer.
   */
  const lookingForward = $derived.by(() => {
    const ideas = trip.trip.ideas
      .filter((i) => !i.promotedAt)
      .map((i) => ({ id: `i${i.id}`, date: i.date, title: i.title, by: i.savedBy }));
    const planned = trip.trip.items
      .filter((i) => !i.confirmed)
      .map((i) => ({ id: `p${i.id}`, date: i.date, title: i.title, by: null as string | null }));
    return [...ideas, ...planned].sort((a, b) => a.date.localeCompare(b.date));
  });

  const openQuestions = $derived(trip.openQuestions());

  /** How many loose ends the home screen shows before folding the rest away. */
  const QUESTION_PREVIEW = 3;
  let showAllQuestions = $state(false);
  const visibleQuestions = $derived(showAllQuestions ? openQuestions : openQuestions.slice(0, QUESTION_PREVIEW));

  async function toggleQuestion(id: number, resolved: boolean) {
    await trip.resolveQuestion(id, resolved);
  }
</script>

<section class="countdown">
  {#if finished}
    <div class="number">✈</div>
    <p class="unit">That was the trip.</p>
  {:else if dayNumber !== null}
    <div class="number">{dayNumber}</div>
    <p class="unit">
      Day {dayNumber} of {trip.trip.days.length || 25}
    </p>
  {:else}
    <div class="number">{until}</div>
    <p class="unit">
      {until === 1 ? 'day until you leave' : 'days until you leave'}
    </p>
  {/if}

  {#if legs.length > 0}
    <div class="route">
      {#each legs as leg, index (leg.country + leg.from)}
        {#if index > 0}<span class="sep">→</span>{/if}
        <span>{leg.country} <span class="sep">{formatCompact(leg.from)}</span></span>
      {/each}
    </div>
  {/if}
</section>

<section class="trip-section">
  <h2>
    {lookingForward.length}
    {lookingForward.length === 1 ? 'thing to look forward to' : 'things to look forward to'}
  </h2>

  {#if lookingForward.length === 0}
    <p class="empty">Nothing saved yet. Ask about a day and keep the answers you like — they collect here.</p>
  {:else}
    <div class="day-list">
      {#each lookingForward as entry (entry.id)}
        <a class="day-row" href="/trips/europe-26/days/{entry.date}">
          <span class="when">{formatCompact(entry.date)}</span>
          <span>
            <p class="place">{entry.title}</p>
            {#if entry.by}
              <p class="sub">saved by {entry.by}</p>
            {/if}
          </span>
          <span class="marks"></span>
        </a>
      {/each}
    </div>
  {/if}
</section>

{#if openQuestions.length > 0}
  <section class="trip-section">
    <h2>{openQuestions.length} still to sort out</h2>
    <!-- Only the first few, because this screen's job is anticipation. A wall
         of eleven unresolved chores under a single thing to look forward to
         makes the trip feel like admin, which is exactly backwards. The rest
         are one tap away and none of them are lost. -->
    {#each visibleQuestions as q (q.id)}
      <div class="question">
        <input type="checkbox" id="q{q.id}" checked={false} onchange={() => toggleQuestion(q.id, true)} />
        <label for="q{q.id}">
          {q.question}
          {#if q.date}
            <span class="q-date">{formatCompact(q.date)}</span>
          {/if}
        </label>
      </div>
    {/each}

    {#if openQuestions.length > QUESTION_PREVIEW}
      <button class="btn btn--secondary" style="margin-top:var(--space-4)" onclick={() => (showAllQuestions = !showAllQuestions)}>
        {showAllQuestions ? 'Show fewer' : `Show ${openQuestions.length - QUESTION_PREVIEW} more`}
      </button>
    {/if}
  </section>
{/if}

<section class="trip-section">
  <h2>Where to next</h2>
  <div class="day-list">
    <a class="day-row" href="/trips/europe-26/days">
      <span class="when">All</span>
      <span>
        <p class="place">Every day</p>
        <p class="sub">The full itinerary, September 9 to October 3</p>
      </span>
      <span class="marks"></span>
    </a>
    <a class="day-row" href="/trips/europe-26/ask?date={focusDate()}">
      <span class="when">Ask</span>
      <span>
        <p class="place">What should we do?</p>
        <p class="sub">Knows where you are and what's booked. Searches for anything current.</p>
      </span>
      <span class="marks"></span>
    </a>
  </div>
</section>
