<script lang="ts">
	import { page } from '$app/stores';
	import Shell from '$lib/components/Shell.svelte';
	import { urls } from '$lib/urls';
</script>

<Shell>
	<div class="flex flex-col items-center justify-center py-12">
		<h1 class="text-4xl font-bold text-gray-100 mb-4">404</h1>
		<p class="text-gray-300 mb-6">
			The page you're looking for doesn't exist.
		</p>
		<a
			href={urls.index}
			class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
		>
			Go Home
		</a>
	</div>
</Shell>
