<script lang="ts">
  import { documentTitle } from '$lib/site';

  /**
   * The head for a page that is not a real address on this site — the error
   * page, which the static build emits as `404.html` for every unknown path.
   * It gets a title like every other page, asks crawlers not to index it, and
   * declares no canonical or `og:url`: both would name the very path that does
   * not exist. Separate from `Seo.svelte` rather than a flag on it, so that
   * component's canonical stays unconditional where svelte-vitals reads it.
   */
  interface Props {
    title: string;
    description: string;
  }

  let { title, description }: Props = $props();
</script>

<svelte:head>
  <title>{documentTitle(title)}</title>
  <meta name="description" content={description} />
  <meta name="robots" content="noindex" />
</svelte:head>
