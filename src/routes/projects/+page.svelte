<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import ProjectCard from '$lib/components/cards/ProjectCard.svelte';
  import { projects } from '$lib/data/projects';
</script>

<Seo
  title="Projects - Michael Bryzek"
  description="Open source projects and products by Michael Bryzek, including Rallyd, API Builder, and Schema Evolution Manager."
/>

<Shell title="Projects">
  <div class="card-grid">
    {#each projects as project}
      <ProjectCard {project} />
    {/each}
  </div>
</Shell>
