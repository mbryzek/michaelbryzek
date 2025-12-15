<script lang="ts">
	import type { Project } from '$lib/types';
	import H2 from '$lib/components/ui/H2.svelte';
	import P from '$lib/components/ui/P.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import BlogIcon from '$lib/components/icons/BlogIcon.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<div class="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
	<div class="flex items-start justify-between mb-4">
		<H2>{project.name}</H2>
		<div class="flex gap-x-4">
			{#if project.projectUrl}
				<ExternalLink href={project.projectUrl}>
					<WebsiteIcon />
				</ExternalLink>
			{/if}
			{#if project.githubUrl}
				<ExternalLink href={project.githubUrl}>
					<GithubIcon />
				</ExternalLink>
			{/if}
			{#if project.blogUrl}
				<ExternalLink href={project.blogUrl}>
					<BlogIcon />
				</ExternalLink>
			{/if}
		</div>
	</div>
	{#each project.description as text}
		<P>{text}</P>
	{/each}
</div>
