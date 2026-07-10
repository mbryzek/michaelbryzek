<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    children: Snippet;
    class?: string;
  }

  let { href, children, class: className = '' }: Props = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" class={className}>
  {@render children()}
</a>
