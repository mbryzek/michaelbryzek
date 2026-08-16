<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<!-- Prevent flash by setting the theme before hydration -->
<svelte:head>
  <script>
    (function () {
      // localStorage throws when storage is blocked (Safari Lockdown Mode,
      // sandboxed iframes). Without the guard the throw aborts this function
      // before data-theme is ever set. That case is no longer a broken page —
      // :root carries the dark palette, so an unset attribute renders the same
      // dark default this script would have written — but it does lose a stored
      // 'light' preference, so keep the guard and set the attribute anyway.
      let stored = null;
      try {
        stored = localStorage.getItem('theme');
      } catch {
        stored = null;
      }
      const theme = stored === 'light' || stored === 'dark' ? stored : 'dark'; // Default to dark
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</svelte:head>

{@render children()}
