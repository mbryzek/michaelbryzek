<script lang="ts">
  import type { Link } from '#lib/types.ts';
  import Card from './Card.svelte';

  interface Props {
    link: Link;
  }

  let { link }: Props = $props();
</script>

<Card title={link.name} href={link.url} description={link.description} />
