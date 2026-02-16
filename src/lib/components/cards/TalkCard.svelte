<script lang="ts">
	import type { Talk } from '$lib/types';

	interface Props {
		talk: Talk;
	}

	let { talk }: Props = $props();
</script>

<a href={talk.videoUrl} target="_blank" rel="noopener noreferrer" class="block group focus:outline-none">
	<div
		class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:bg-[var(--bg-hover)] hover:shadow-lg transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--bg-base)]"
	>
		<div class="mb-4">
			<h2 class="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-200">
				{talk.title}
			</h2>
			<p class="text-[var(--text-tertiary)] text-sm mt-2 italic">
				{talk.event} • {talk.date}
			</p>
		</div>
		<p class="text-[var(--text-secondary)] leading-relaxed text-[15px]">
			{talk.description}
		</p>
	</div>
</a>
