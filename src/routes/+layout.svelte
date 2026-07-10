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
      const stored = localStorage.getItem('theme');
      const theme = stored === 'light' || stored === 'dark' ? stored : 'dark'; // Default to dark
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</svelte:head>

{@render children()}
