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

<ul class="mt-4 list-disc pl-8 text-[var(--text-secondary)] space-y-3 {className}">
	{#each items as item}
		<li class="leading-relaxed">
			<div class="flex flex-col gap-y-2">
				<div class="font-semibold text-[var(--text-primary)]">{item.title}</div>
				<div>{item.content}</div>
			</div>
		</li>
	{/each}
</ul>
