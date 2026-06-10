<script lang="ts">
	import type { Link } from '$lib/types';

	interface Props {
		link: Link;
	}

	let { link }: Props = $props();
</script>

<a class="project" href={link.url} target="_blank" rel="noopener noreferrer">
	<div class="project-top">
		<p class="pname">{link.name}</p>
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
	<div class="flex flex-col gap-2 flex-1">
		{#each link.description as text}
			<p class="pdesc">{text}</p>
		{/each}
	</div>
</a>
