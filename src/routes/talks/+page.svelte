<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import TalkCard from '$lib/components/cards/TalkCard.svelte';
	import { talks } from '$lib/data/talks';
</script>

<Shell>
	<div class="grid">
		{#each talks as talk}
			<TalkCard {talk} />
		{/each}
	</div>
</Shell>
