<script lang="ts">
  import type { Talk } from '$lib/types';
  import Link from '$lib/components/ui/Link.svelte';
  import ArrowUpRightIcon from '$lib/components/icons/ArrowUpRightIcon.svelte';

  interface Props {
    talk: Talk;
  }

  let { talk }: Props = $props();
</script>

<Link class="project focus-ring" href={talk.videoUrl}>
  <div class="project-top">
    <p class="pname">{talk.title}</p>
    <span class="arrow"><ArrowUpRightIcon /></span>
  </div>
  <p class="talk-meta">{talk.event} · {talk.date}</p>
  <p class="pdesc">{talk.description}</p>
</Link>

<style>
  .talk-meta {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-subtle);
    margin: 0;
  }
</style>
