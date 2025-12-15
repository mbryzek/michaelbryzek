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

<a href={link.url} target="_blank" rel="noopener noreferrer">
	<div class="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer">
		<div class="flex items-start justify-between mb-4">
			<H2>{link.name}</H2>
			<ExternalLink href={link.url}>
				<WebsiteIcon />
			</ExternalLink>
		</div>
		{#each link.description as text}
			<P>{text}</P>
		{/each}
	</div>
</a>
