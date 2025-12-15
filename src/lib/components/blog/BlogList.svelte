<script lang="ts">
	interface Props {
		items: string[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<ul class="mt-4 list-disc pl-8 text-gray-100 {className}">
	{#each items as item}
		<li class="mt-2">{item}</li>
	{/each}
</ul>
