<script lang="ts">
  import type { Link as LinkData } from '$lib/types';
  import Link from '$lib/components/ui/Link.svelte';
  import ArrowUpRightIcon from '$lib/components/icons/ArrowUpRightIcon.svelte';

  interface Props {
    link: LinkData;
  }

  let { link }: Props = $props();
</script>

<Link class="project" href={link.url}>
  <div class="project-top">
    <p class="pname">{link.name}</p>
    <span class="arrow"><ArrowUpRightIcon /></span>
  </div>
  <div class="flex flex-1 flex-col gap-2">
    {#each link.description as text}
      <p class="pdesc">{text}</p>
    {/each}
  </div>
</Link>
