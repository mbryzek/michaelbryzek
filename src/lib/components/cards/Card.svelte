<script lang="ts">
  import type { Snippet } from 'svelte';
  import Link from '$lib/components/ui/Link.svelte';
  import ArrowUpRightIcon from '$lib/components/icons/ArrowUpRightIcon.svelte';

  /**
   * The shell every card in a `.card-grid` shares: the `.project` container, the
   * `.project-top` title row and the description paragraphs. `app.css` styles it
   * by those class names (and `focusRing.test.ts` reads them), so they are
   * spelled here and nowhere else.
   *
   * Two shapes, and the type keeps them apart:
   *
   * - `href` — the whole card is one anchor, marked by the arrow. Nothing inside
   *   it may be interactive, so it takes no `titleHref` and no `trailing`.
   * - no `href` — the card is a plain container whose interactive pieces are
   *   their own anchors: the title (`titleHref`) and whatever `trailing` renders.
   *   Wrapping those in an outer anchor would nest interactive content, which is
   *   invalid HTML and breaks keyboard and screen-reader semantics.
   */
  type Props = {
    title: string;
    description: string[];
    /** Rendered between the title row and the description. */
    children?: Snippet;
  } & ({ href: string; titleHref?: never; trailing?: never } | { href?: never; titleHref?: string | undefined; trailing?: Snippet });

  let { title, description, children, href, titleHref, trailing }: Props = $props();
</script>

{#snippet body()}
  <div class="project-top">
    {#if titleHref}
      <Link class="pname" href={titleHref}>{title}</Link>
    {:else}
      <p class="pname">{title}</p>
    {/if}
    {#if href}
      <span class="arrow"><ArrowUpRightIcon /></span>
    {:else}
      {@render trailing?.()}
    {/if}
  </div>
  {@render children?.()}
  <div class="flex flex-1 flex-col gap-2">
    {#each description as text, i (i)}
      <p class="pdesc">{text}</p>
    {/each}
  </div>
{/snippet}

{#if href}
  <Link class="project" {href}>{@render body()}</Link>
{:else}
  <div class="project">{@render body()}</div>
{/if}
