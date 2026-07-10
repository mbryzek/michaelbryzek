<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import LinkCard from '$lib/components/cards/LinkCard.svelte';
  import { links } from '$lib/data/links';
</script>

<svelte:head>
  <title>Links - Michael Bryzek</title>
  <meta name="description" content="Links to people and projects connected to Michael Bryzek." />
</svelte:head>

<Shell title="Links">
  <div class="card-grid">
    {#each links as link}
      <LinkCard {link} />
    {/each}
  </div>
</Shell>
