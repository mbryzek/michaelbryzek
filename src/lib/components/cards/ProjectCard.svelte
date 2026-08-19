<script lang="ts">
  import type { Project } from '$lib/types';
  import Link from '$lib/components/ui/Link.svelte';
  import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';
  import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
  import BlogIcon from '$lib/components/icons/BlogIcon.svelte';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();

  // Primary link priority: projectUrl > githubUrl > blogUrl
  let primaryUrl = $derived(project.projectUrl || project.githubUrl || project.blogUrl || '');
</script>

<!--
  The card is a plain container. Its interactive elements — the project name
  and each icon — are real <a> anchors. We must NOT wrap the whole card in an
  outer <a> and then nest these anchors/buttons inside it: nested interactive
  content is invalid HTML and breaks keyboard + screen-reader semantics (the
  previous version did exactly that). Real anchors also restore native
  middle-click / open-in-new-tab / status-bar URL behavior.
-->
<div class="project">
  <div class="project-top">
    {#if primaryUrl}
      <Link class="pname" href={primaryUrl}>{project.name}</Link>
    {:else}
      <p class="pname">{project.name}</p>
    {/if}
    <div class="card-icons">
      {#if project.projectUrl}
        <Link class="focus-ring" href={project.projectUrl} ariaLabel="Project website"><WebsiteIcon /></Link>
      {/if}
      {#if project.githubUrl}
        <Link class="focus-ring" href={project.githubUrl} ariaLabel="GitHub repository"><GithubIcon /></Link>
      {/if}
      {#if project.blogUrl}
        <Link class="focus-ring" href={project.blogUrl} ariaLabel="Blog post"><BlogIcon /></Link>
      {/if}
    </div>
  </div>
  <div class="flex flex-1 flex-col gap-2">
    {#each project.description as text}
      <p class="pdesc">{text}</p>
    {/each}
  </div>
</div>
