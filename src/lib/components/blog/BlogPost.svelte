<script lang="ts">
	import H1 from '$lib/components/ui/H1.svelte';

	interface Props {
		title: string;
		date: string;
		children: any;
	}

	let { title, date, children }: Props = $props();
</script>

<div>
	<H1>{title}</H1>
	<div class="mt-2 italic text-gray-100">{date}</div>
	{@render children()}
</div>
