<script lang="ts">
	interface Props {
		lines: string[];
		class?: string;
	}

	let { lines, class: className = '' }: Props = $props();
</script>

<div
	class="mt-4 w-full max-w-2xl bg-[#1E1E1E] text-gray-300 rounded-lg p-4 shadow-lg overflow-x-auto border border-gray-700 {className}"
>
	{#each lines as line}
		<div class="whitespace-pre-wrap">{line}</div>
	{/each}
</div>
