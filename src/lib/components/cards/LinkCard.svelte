<script lang="ts">
  import type { Link } from '$lib/types';
  import Card from './Card.svelte';

  interface Props {
    link: Link;
  }

  let { link }: Props = $props();
</script>

<Card title={link.name} href={link.url} description={link.description} />
