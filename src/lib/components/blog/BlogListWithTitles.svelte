<script lang="ts">
	export interface ItemWithTitle {
		title: string;
		content: string;
	}

	interface Props {
		items: ItemWithTitle[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<ul class="mt-4 list-disc pl-8 text-gray-100 {className}">
	{#each items as item}
		<li class="mt-2">
			<div class="flex flex-col gap-y-2">
				<div class="font-bold">{item.title}</div>
				<div>{item.content}</div>
			</div>
		</li>
	{/each}
</ul>
