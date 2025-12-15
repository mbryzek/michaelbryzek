<script lang="ts">
	import type { Talk } from '$lib/types';
	import H2 from '$lib/components/ui/H2.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';

	interface Props {
		talk: Talk;
	}

	let { talk }: Props = $props();
</script>

<div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition-colors">
	<div class="flex items-start justify-between mb-2">
		<div>
			<H2>
				<ExternalLink href={talk.videoUrl}>{talk.title}</ExternalLink>
			</H2>
			<p class="text-gray-300 leading-relaxed italic">
				{talk.event} • {talk.date}
			</p>
		</div>
	</div>
	<p class="text-gray-300 leading-relaxed">
		{talk.description}
	</p>
</div>
