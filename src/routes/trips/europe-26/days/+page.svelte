<script lang="ts">
  import { onMount } from 'svelte';
  import { trip } from '$lib/trip/store.svelte';
  import { formatCompact, formatWeekday, today } from '$lib/trip/dates';

  const now = today();

  onMount(() => {
    // Scroll the current day into view rather than opening at September 9 for
    // the whole trip. Instant, not smooth: an animated scroll on entry reads as
    // the page moving under you.
    const el = document.querySelector('[data-today="true"]');
    el?.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
</script>

<h1 class="page-title">Every day</h1>

{#if trip.trip.days.length === 0}
  <p class="empty">Loading the itinerary…</p>
{:else}
  <div class="day-list">
    {#each trip.trip.days as day (day.date)}
      {@const items = trip.itemsOn(day.date)}
      {@const ideas = trip.ideasOn(day.date)}
      {@const notes = trip.notesOn(day.date)}
      {@const booked = items.filter((i) => i.confirmed)}
      <a class="day-row" class:is-today={day.date === now} data-today={day.date === now} href="/trips/europe-26/days/{day.date}">
        <!-- Two deliberate lines. On one line "Wed Sep 12" overflows the column
             at 375px and wraps after "Sep", which reads as a layout bug. -->
        <span class="when">
          <span class="wd">{formatWeekday(day.date)}</span>
          {formatCompact(day.date)}
        </span>
        <span>
          <p class="place">{day.place}</p>
          <p class="sub">
            {#if booked.length > 0}
              {booked.length}
              {booked.length === 1 ? 'booking' : 'bookings'}{day.summary ? ` · ${day.summary}` : ''}
            {:else}
              {day.summary ?? 'Open day'}
            {/if}
          </p>
        </span>
        <span class="marks">
          {#if ideas.length > 0}
            <span class="mark mark--idea" title="{ideas.length} saved">{ideas.length}</span>
          {/if}
          {#if notes.length > 0}
            <span class="mark mark--note" title="{notes.length} notes">{notes.length}</span>
          {/if}
        </span>
      </a>
    {/each}
  </div>
{/if}
