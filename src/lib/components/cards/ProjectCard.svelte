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
</script>

{#if primaryUrl !== '#'}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="block group focus:outline-none h-full cursor-pointer"
		tabindex="0"
		role="link"
		onclick={() => window.open(primaryUrl, '_blank', 'noopener,noreferrer')}
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(primaryUrl, '_blank', 'noopener,noreferrer'); } }}
	>
		<div
			class="h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:bg-[var(--bg-hover)] hover:shadow-lg transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--bg-base)] flex flex-col"
		>
			<div class="flex items-start justify-between mb-4">
				<h2 class="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-200">
					{project.name}
				</h2>
				<div class="flex gap-x-3 relative z-10 group/icons">
					{#if project.projectUrl}
						<a
							href={project.projectUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 {isPrimaryProject ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							style="transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);"
							aria-label="Project website"
							onclick={(e) => e.stopPropagation()}
						>
							<WebsiteIcon />
						</a>
					{/if}
					{#if project.githubUrl}
						<a
							href={project.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 {isPrimaryGithub ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							style="transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);"
							aria-label="GitHub repository"
							onclick={(e) => e.stopPropagation()}
						>
							<GithubIcon />
						</a>
					{/if}
					{#if project.blogUrl}
						<a
							href={project.blogUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-[var(--text-tertiary)] hover:text-[var(--secondary)] hover:scale-125 {isPrimaryBlog ? 'group-hover:text-[var(--secondary)] group-hover:scale-125 group-hover/icons:text-[var(--text-tertiary)] group-hover/icons:scale-100' : ''}"
							style="transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);"
							aria-label="Blog post"
							onclick={(e) => e.stopPropagation()}
						>
							<BlogIcon />
						</a>
					{/if}
				</div>
			</div>
			<div class="space-y-3 flex-1">
				{#each project.description as text}
					<P>{text}</P>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<!-- Fallback if no links available -->
	<div
		class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 transition-all duration-200"
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
