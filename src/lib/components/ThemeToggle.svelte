<script lang="ts">
  import { browser } from '$app/environment';

  // Which icon shows is decided purely by the `data-theme` attribute that the
  // no-flash script in +layout.svelte stamps onto <html> before first paint —
  // see the CSS below. Holding it in component state instead meant the
  // prerendered HTML always shipped the dark-mode icon and a light-theme
  // visitor watched it flip after hydration, on every page load.
  function toggleTheme() {
    if (!browser) return;

    const html = document.documentElement;
    const nextTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', nextTheme);
    // Storage can be blocked (Safari Lockdown Mode, sandboxed iframes). The
    // theme still applies for this page view; only persistence is lost.
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // Nothing to do — the preference simply is not remembered here.
    }

    setTimeout(() => html.classList.remove('theme-transitioning'), 200);
  }
</script>

<button onclick={toggleTheme} class="theme-toggle" aria-label="Toggle color theme" title="Toggle theme" type="button">
  <!-- Sun — shown in dark mode, switches to light -->
  <svg
    class="icon icon-sun"
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
  <!-- Moon — shown in light mode, switches to dark -->
  <svg
    class="icon icon-moon"
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
</button>

<style>
  /* Dark is the default when no preference has been stored, so the sun shows
     unless <html> is explicitly in light mode. Both icons are in the markup and
     CSS picks between them, so the correct one is painted on the first frame —
     there is no JS state to hydrate and therefore nothing to flip.

     This keys off the absence of the attribute, exactly as the palette in
     app.css does, so the two cannot disagree about what "no data-theme" means.
     They did once: the palette's fallback was light while this one's was dark,
     and a visitor without JS got a light page offering to switch to light. */
  .icon-moon {
    display: none;
  }
  :global(html[data-theme='light']) .icon-sun {
    display: none;
  }
  :global(html[data-theme='light']) .icon-moon {
    display: block;
  }
</style>
