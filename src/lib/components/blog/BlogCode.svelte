<script lang="ts">
	interface Props {
		lines: string[];
		class?: string;
	}

	let { lines, class: className = '' }: Props = $props();
</script>

<div
	class="mt-4 w-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg p-5 overflow-x-auto border border-[var(--border)] font-mono text-sm {className}"
>
	{#each lines as line}
		<div class="whitespace-pre-wrap leading-relaxed">{line}</div>
	{/each}
</div>
