<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import P from '$lib/components/ui/P.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
</script>

<Shell>
	<div class="max-w-2xl mx-auto space-y-6">
		<p class="text-[var(--text-primary)] text-lg leading-relaxed">
			My name is Michael Bryzek and I'm a developer and serial entrepreneur living in New Jersey.
		</p>
		<p class="text-[var(--text-primary)] text-lg leading-relaxed">
			I'm best known for founding Gilt Groupe in 2007 and Flow Commerce in 2015, which now powers
			international commerce inside Shopify.
		</p>
		<p class="text-[var(--text-primary)] text-lg leading-relaxed">
			Recently, I spend most of my time building <ExternalLink
				href="https://rallyd.net">Rallyd</ExternalLink
			>, an AI-powered pickleball game scheduling application.
		</p>
	</div>
</Shell>
