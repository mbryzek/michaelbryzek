<script lang="ts">
	import H1 from '$lib/components/ui/H1.svelte';

	interface Props {
		title: string;
		date: string;
		children: any;
	}

	let { title, date, children }: Props = $props();
</script>

<article class="max-w-3xl">
	<header class="mb-8">
		<H1>{title}</H1>
		<div class="mt-3 text-[var(--text-tertiary)] text-sm">{date}</div>
	</header>
	<div class="prose prose-invert">
		{@render children()}
	</div>
</article>
