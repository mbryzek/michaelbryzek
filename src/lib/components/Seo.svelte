<script lang="ts">
  import { page } from '$app/state';
  import { absoluteUrl, SITE_NAME } from '$lib/site';

  interface Props {
    /**
     * The page's own part of the title. The site name and the separator are
     * appended here, never by the caller — a caller free to spell the name out
     * keeps its own copy of it, and `SITE_NAME` then governs `og:site_name`
     * alone while every browser tab says whatever was typed.
     */
    title: string;
    description: string;
    /**
     * The home page reads `<site name> - <its own part>`; every other page
     * reads `<its own part> - <site name>`.
     */
    nameFirst?: boolean;
  }

  let { title, description, nameFirst = false }: Props = $props();

  const documentTitle = $derived(nameFirst ? `${SITE_NAME} - ${title}` : `${title} - ${SITE_NAME}`);

  // Canonical comes from the actual route rather than a hand-passed path, so a
  // page cannot end up declaring itself canonical at someone else's URL.
  const canonical = $derived(absoluteUrl(page.url.pathname));
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={documentTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={documentTitle} />
  <meta name="twitter:description" content={description} />
</svelte:head>
