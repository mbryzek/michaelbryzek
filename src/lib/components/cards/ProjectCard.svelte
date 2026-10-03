<script lang="ts">
  import type { Project } from '$lib/types';
  import Card from './Card.svelte';
  import Link from '$lib/components/ui/Link.svelte';
  import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';
  import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
  import BlogIcon from '$lib/components/icons/BlogIcon.svelte';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();

  // Primary link priority: projectUrl > githubUrl > blogUrl
  let primaryUrl = $derived(project.projectUrl || project.githubUrl || project.blogUrl || undefined);
</script>

<!--
  A project has several links (the name and each icon), so it is the card's
  non-anchor shape: each is a real <a>, and none sits inside an outer one.
-->
<Card title={project.name} titleHref={primaryUrl} description={project.description}>
  {#snippet trailing()}
    <div class="card-icons">
      {#if project.projectUrl}
        <Link href={project.projectUrl} ariaLabel="Project website"><WebsiteIcon /></Link>
      {/if}
      {#if project.githubUrl}
        <Link href={project.githubUrl} ariaLabel="GitHub repository"><GithubIcon /></Link>
      {/if}
      {#if project.blogUrl}
        <Link href={project.blogUrl} ariaLabel="Blog post"><BlogIcon /></Link>
      {/if}
    </div>
  {/snippet}
</Card>
