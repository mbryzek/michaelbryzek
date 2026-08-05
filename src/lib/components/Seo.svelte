<script lang="ts">
  import { page } from '$app/state';
  import { absoluteUrl, SITE_NAME } from '$lib/site';

  interface Props {
    title: string;
    description: string;
  }

  let { title, description }: Props = $props();

  // Canonical comes from the actual route rather than a hand-passed path, so a
  // page cannot end up declaring itself canonical at someone else's URL.
  const canonical = $derived(absoluteUrl(page.url.pathname));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>
