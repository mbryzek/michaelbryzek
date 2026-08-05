<script lang="ts">
  import type { Project } from '$lib/types';
  import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';
  import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
  import BlogIcon from '$lib/components/icons/BlogIcon.svelte';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();

  // Primary link priority: projectUrl > githubUrl > blogUrl
  let primaryUrl = $derived(project.projectUrl || project.githubUrl || project.blogUrl || '');

  // `blogUrl` is a path on this site; `projectUrl` and `githubUrl` are absolute
  // and belong on another origin. Only the latter get a new tab — opening our
  // own page in one bypasses client-side routing and strands the visitor in a
  // second tab of the same site.
  function isExternal(url: string): boolean {
    return url.startsWith('http');
  }
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
      <a
        class="pname"
        href={primaryUrl}
        target={isExternal(primaryUrl) ? '_blank' : undefined}
        rel={isExternal(primaryUrl) ? 'noopener noreferrer' : undefined}
      >
        {project.name}
      </a>
    {:else}
      <p class="pname">{project.name}</p>
    {/if}
    <div class="card-icons">
      {#if project.projectUrl}
        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" aria-label="Project website">
          <WebsiteIcon />
        </a>
      {/if}
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
          <GithubIcon />
        </a>
      {/if}
      {#if project.blogUrl}
        <a href={project.blogUrl} aria-label="Blog post">
          <BlogIcon />
        </a>
      {/if}
    </div>
  </div>
  <div class="flex flex-1 flex-col gap-2">
    {#each project.description as text}
      <p class="pdesc">{text}</p>
    {/each}
  </div>
</div>

<style>
  /* The name renders as an anchor now; strip default link styling so it keeps
     the previous look and the card's hover treatment (.project:hover .pname). */
  a.pname {
    text-decoration: none;
    color: inherit;
  }
  a.pname:hover {
    color: var(--accent-text);
  }
</style>
