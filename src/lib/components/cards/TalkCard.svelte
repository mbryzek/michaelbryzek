<script lang="ts">
  import type { Talk } from '$lib/types';
  import Card from './Card.svelte';

  interface Props {
    talk: Talk;
  }

  let { talk }: Props = $props();
</script>

<Card title={talk.title} href={talk.videoUrl} description={talk.description}>
  <p class="talk-meta">{talk.event} · {talk.date}</p>
</Card>

<style>
  .talk-meta {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-subtle);
    margin: 0;
  }
</style>
