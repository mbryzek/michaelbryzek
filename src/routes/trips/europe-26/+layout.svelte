<script lang="ts">
  import '$lib/trip/trip.css';
  import { onMount, type Snippet } from 'svelte';
  import { page } from '$app/state';
  import { trip } from '$lib/trip/store.svelte';
  import { focusDate } from '$lib/trip/dates';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  let name = $state('');
  let password = $state('');
  let unlocking = $state(false);
  let lockError = $state<string | null>(null);

  onMount(async () => {
    await trip.checkSession();
    if (trip.signedIn) await trip.load();
  });

  async function unlock(event: SubmitEvent) {
    event.preventDefault();
    if (!name.trim() || !password) return;

    unlocking = true;
    lockError = null;
    try {
      await trip.signIn(name.trim(), password);
      password = '';
    } catch (err) {
      lockError = err instanceof Error ? err.message : 'Could not sign in';
    } finally {
      unlocking = false;
    }
  }

  const askHref = $derived(`/trips/europe-26/ask?date=${focusDate()}`);
  const path = $derived(page.url.pathname.replace(/\/$/, ''));
</script>

<svelte:head>
  <title>Europe 2026</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#16191f" />
  <link rel="manifest" href="/trips/europe-26/manifest.webmanifest" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Europe 2026" />
</svelte:head>

{#if trip.signedIn === null}
  <!-- Session check in flight. Deliberately blank rather than a spinner: it
       resolves in a few milliseconds from cache and a flash of loading UI is
       worse than a beat of nothing. -->
  <div class="lock"></div>
{:else if !trip.signedIn}
  <div class="lock">
    <div class="lock-inner">
      <h1>Europe 2026</h1>
      <p>Mike and Lisa · September 9 – October 3</p>
      <form onsubmit={unlock}>
        <label class="sr-only" for="who">Your name</label>
        <input id="who" class="field" bind:value={name} placeholder="Your name" autocomplete="given-name" required />
        <label class="sr-only" for="pw">Password</label>
        <input
          id="pw"
          class="field"
          type="password"
          bind:value={password}
          placeholder="Password"
          autocomplete="current-password"
          required
        />
        <button class="btn" type="submit" disabled={unlocking}>
          {unlocking ? 'Checking…' : 'Open the trip'}
        </button>
        {#if lockError}
          <p class="trip-error">{lockError}</p>
        {/if}
      </form>
    </div>
  </div>
{:else}
  <div class="trip">
    <header class="trip-bar">
      <div class="trip-bar-inner">
        <a class="where" href="/trips/europe-26">Europe 2026</a>
        {#if trip.name}
          <span class="who">{trip.name}</span>
        {/if}
      </div>
    </header>

    <main class="trip-main">
      {#if trip.stale}
        <p class="stale-banner">Showing your saved copy — no connection right now.</p>
      {/if}
      {#if trip.errorMessage}
        <p class="trip-error">{trip.errorMessage}</p>
      {/if}
      {@render children()}
    </main>

    <nav class="trip-nav" aria-label="Trip">
      <a href="/trips/europe-26" aria-current={path === '/trips/europe-26' ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 9.5V21h14V9.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Trip
      </a>
      <a href="/trips/europe-26/days" aria-current={path.startsWith('/trips/europe-26/days') ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" />
        </svg>
        Days
      </a>
      <a href={askHref} aria-current={path.startsWith('/trips/europe-26/ask') ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-4.2A8 8 0 1 1 21 12Z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Ask
      </a>
    </nav>
  </div>
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
