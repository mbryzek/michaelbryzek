<script lang="ts">
	import type { Link } from '$lib/types';
	import ArrowUpRightIcon from '$lib/components/icons/ArrowUpRightIcon.svelte';

	interface Props {
		link: Link;
	}

	let { link }: Props = $props();
</script>

<a class="project" href={link.url} target="_blank" rel="noopener noreferrer">
	<div class="project-top">
		<p class="pname">{link.name}</p>
		<span class="arrow"><ArrowUpRightIcon /></span>
	</div>
	<div class="flex flex-col gap-2 flex-1">
		{#each link.description as text}
			<p class="pdesc">{text}</p>
		{/each}
	</div>
</a>
