<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import ProjectCard from '$lib/components/cards/ProjectCard.svelte';
	import { projects } from '$lib/data/projects';
</script>

<svelte:head>
	<title>Projects - Michael Bryzek</title>
	<meta name="description" content="Open source projects and products by Michael Bryzek, including Rallyd, API Builder, and Schema Evolution Manager." />
</svelte:head>

<Shell title="Projects">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</Shell>
