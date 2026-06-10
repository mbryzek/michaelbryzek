<script lang="ts">
	import type { Talk } from '$lib/types';

	interface Props {
		talk: Talk;
	}

	let { talk }: Props = $props();
</script>

<a class="project" href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
	<div class="project-top">
		<p class="pname">{talk.title}</p>
		<span class="arrow" aria-hidden="true">
			<svg
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="7" y1="17" x2="17" y2="7"></line>
				<polyline points="7 7 17 7 17 17"></polyline>
			</svg>
		</span>
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
