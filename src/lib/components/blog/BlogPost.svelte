<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		date: string;
		children: Snippet;
	}

	let { title, date, children }: Props = $props();
</script>

<article class="article">
	<div class="article-meta">{date}</div>
	<h1>{title}</h1>
</article>
<div class="prose mt-6">
	{@render children()}
</div>
