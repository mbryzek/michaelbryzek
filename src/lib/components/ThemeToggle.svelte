<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let isDark = $state(true); // Default to dark mode

  onMount(() => {
    if (browser) {
      // The no-flash script in +layout.svelte already set data-theme before paint;
      // here we only sync the toggle's icon state to the stored preference.
      const stored = localStorage.getItem('theme');
      isDark = stored === 'light' ? false : true;
    }
  });

  function toggleTheme() {
    if (!browser) return;

    isDark = !isDark;

    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    setTimeout(() => html.classList.remove('theme-transitioning'), 200);
  }
</script>

<button onclick={toggleTheme} class="theme-toggle" aria-label="Toggle color theme" title="Toggle theme" type="button">
  {#if isDark}
    <!-- Sun — switch to light -->
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
    </svg>
  {:else}
    <!-- Moon — switch to dark -->
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  {/if}
</button>
