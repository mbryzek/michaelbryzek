<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';
	import { links } from '$lib/data/links';
</script>

<Shell title="Links">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each links as link}
			<LinkCard {link} />
		{/each}
	</div>
</Shell>
