<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import TalkCard from '$lib/components/cards/TalkCard.svelte';
	import { talks } from '$lib/data/talks';
</script>

<svelte:head>
	<title>Talks - Michael Bryzek</title>
	<meta name="description" content="Conference talks and presentations by Michael Bryzek on microservices, testing in production, and startups." />
</svelte:head>

<Shell title="Talks">
	<div class="space-y-6">
		{#each talks as talk}
			<TalkCard {talk} />
		{/each}
	</div>
</Shell>
