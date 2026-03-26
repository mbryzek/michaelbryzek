<script lang="ts">
	import type { Project } from '$lib/types';
	import H2 from '$lib/components/ui/H2.svelte';
	import P from '$lib/components/ui/P.svelte';
	import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import BlogIcon from '$lib/components/icons/BlogIcon.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	// Determine primary link (priority: projectUrl > githubUrl > blogUrl)
	let primaryUrl = $derived(project.projectUrl || project.githubUrl || project.blogUrl || '#');
	let isPrimaryProject = $derived(!!project.projectUrl);
	let isPrimaryGithub = $derived(!project.projectUrl && !!project.githubUrl);
	let isPrimaryBlog = $derived(!project.projectUrl && !project.githubUrl && !!project.blogUrl);

	function openUrl(e: MouseEvent, url: string) {
		e.preventDefault();
		e.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

{#if primaryUrl !== '#'}
	<a href={primaryUrl} target="_blank" rel="noopener noreferrer" class="block group focus:outline-none h-full">
		<div
			class="h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:bg-[var(--bg-hover)] hover:shadow-lg transition-colors transition-shadow duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--bg-base)] flex flex-col"
		>
			<div class="flex items-start justify-between mb-4">
				<h2 class="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-200">
					{project.name}
				</h2>
				<div class="flex gap-x-3 relative z-10 group/icons">
					{#if project.projectUrl}
						<button
							type="button"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 card-icon-transition cursor-pointer {isPrimaryProject ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							aria-label="Project website"
							onclick={(e: MouseEvent) => openUrl(e, project.projectUrl!)}
						>
							<WebsiteIcon />
						</button>
					{/if}
					{#if project.githubUrl}
						<button
							type="button"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 card-icon-transition cursor-pointer {isPrimaryGithub ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							aria-label="GitHub repository"
							onclick={(e: MouseEvent) => openUrl(e, project.githubUrl!)}
						>
							<GithubIcon />
						</button>
					{/if}
					{#if project.blogUrl}
						<button
							type="button"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 card-icon-transition cursor-pointer {isPrimaryBlog ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							aria-label="Blog post"
							onclick={(e: MouseEvent) => openUrl(e, project.blogUrl!)}
						>
							<BlogIcon />
						</button>
					{/if}
				</div>
			</div>
			<div class="space-y-3 flex-1">
				{#each project.description as text}
					<P>{text}</P>
				{/each}
			</div>
		</div>
	</a>
{:else}
	<div
		class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 transition-colors duration-200"
	>
		<div class="mb-4">
			<H2>{project.name}</H2>
		</div>
		<div class="space-y-3">
			{#each project.description as text}
				<P>{text}</P>
			{/each}
		</div>
	</div>
{/if}
