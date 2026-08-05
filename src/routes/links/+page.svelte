<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import LinkCard from '$lib/components/cards/LinkCard.svelte';
  import { links } from '$lib/data/links';
</script>

<Seo title="Links - Michael Bryzek" description="Links to people and projects connected to Michael Bryzek." />

<Shell title="Links">
  <div class="card-grid">
    {#each links as link}
      <LinkCard {link} />
    {/each}
  </div>
</Shell>
