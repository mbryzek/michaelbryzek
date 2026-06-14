<script lang="ts">
	import type { Talk } from '$lib/types';
	import ArrowUpRightIcon from '$lib/components/icons/ArrowUpRightIcon.svelte';

	interface Props {
		talk: Talk;
	}

	let { talk }: Props = $props();
</script>

<a class="project" href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
	<div class="project-top">
		<p class="pname">{talk.title}</p>
		<span class="arrow"><ArrowUpRightIcon /></span>
	</div>
	<p class="talk-meta">{talk.event} · {talk.date}</p>
	<p class="pdesc">{talk.description}</p>
</a>

<style>
	.talk-meta {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-subtle);
		margin: 0;
	}
</style>
