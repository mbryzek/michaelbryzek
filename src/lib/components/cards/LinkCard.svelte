<script lang="ts">
	import type { Link } from '$lib/types';
	import H2 from '$lib/components/ui/H2.svelte';
	import P from '$lib/components/ui/P.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import WebsiteIcon from '$lib/components/icons/WebsiteIcon.svelte';

	interface Props {
		link: Link;
	}

	let { link }: Props = $props();
</script>

<a href={link.url} target="_blank" rel="noopener noreferrer" class="block group focus:outline-none h-full">
	<div
		class="h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:bg-[var(--bg-hover)] hover:shadow-lg transition-all duration-200 cursor-pointer group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--bg-base)] flex flex-col"
	>
		<div class="flex items-start justify-between mb-4">
			<h2 class="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-200">
				{link.name}
			</h2>
			<span
				class="text-[var(--text-tertiary)] group-hover:text-[var(--secondary)] group-hover:scale-125"
				style="transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);"
				aria-label="External link"
			>
				<WebsiteIcon />
			</span>
		</div>
		<div class="space-y-3 flex-1">
			{#each link.description as text}
				<P>{text}</P>
			{/each}
		</div>
	</div>
</a>
