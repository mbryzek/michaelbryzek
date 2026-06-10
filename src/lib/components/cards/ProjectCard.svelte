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
	let primaryUrl = $derived(project.projectUrl || project.githubUrl || project.blogUrl || '#');

	function openUrl(e: MouseEvent, url: string) {
		e.preventDefault();
		e.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

{#snippet body()}
	<div class="project-top">
		<p class="pname">{project.name}</p>
		<div class="card-icons">
			{#if project.projectUrl}
				<button
					type="button"
					aria-label="Project website"
					onclick={(e: MouseEvent) => openUrl(e, project.projectUrl!)}
				>
					<WebsiteIcon />
				</button>
			{/if}
			{#if project.githubUrl}
				<button
					type="button"
					aria-label="GitHub repository"
					onclick={(e: MouseEvent) => openUrl(e, project.githubUrl!)}
				>
					<GithubIcon />
				</button>
			{/if}
			{#if project.blogUrl}
				<button
					type="button"
					aria-label="Blog post"
					onclick={(e: MouseEvent) => openUrl(e, project.blogUrl!)}
				>
					<BlogIcon />
				</button>
			{/if}
		</div>
	</div>
	<div class="flex flex-col gap-2 flex-1">
		{#each project.description as text}
			<p class="pdesc">{text}</p>
		{/each}
	</div>
{/snippet}

{#if primaryUrl !== '#'}
	<a class="project" href={primaryUrl} target="_blank" rel="noopener noreferrer">
		{@render body()}
	</a>
{:else}
	<div class="project" style="cursor:default">
		{@render body()}
	</div>
{/if}
