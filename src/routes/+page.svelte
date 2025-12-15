<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import P from '$lib/components/ui/P.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
</script>

<Shell>
	<P
		>My name is Michael Bryzek and I'm a developer and serial entrepreneur living in New Jersey.</P
	>
	<P class="mt-4"
		>I'm best known for founding Gilt Groupe in 2007 and Flow Commerce in 2015, which now powers
		international commerce inside Shopify.</P
	>
	<P class="mt-4">
		Recently, I spend most of my time building <ExternalLink href="https://privatedinkers.com"
			>Private Dinkers</ExternalLink
		>, an AI-powered pickleball game scheduling application.
	</P>
</Shell>
