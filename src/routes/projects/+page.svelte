<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import ProjectCard from '$lib/components/cards/ProjectCard.svelte';
	import { projects } from '$lib/data/projects';
</script>

<Shell title="Projects">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</Shell>
