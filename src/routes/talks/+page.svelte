<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import TalkCard from '$lib/components/cards/TalkCard.svelte';
  import { talks } from '$lib/data/talks';
</script>

<Seo
  title="Talks - Michael Bryzek"
  description="Conference talks and presentations by Michael Bryzek on microservices, testing in production, and startups."
/>

<Shell title="Talks">
  <div class="card-grid">
    {#each talks as talk}
      <TalkCard {talk} />
    {/each}
  </div>
</Shell>
