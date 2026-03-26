<script lang="ts">
	import { page } from '$app/stores';
	import Shell from '$lib/components/Shell.svelte';
	import { urls } from '$lib/urls';
</script>

<Shell>
	<div class="flex flex-col items-center justify-center py-12">
		<h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">{$page.status}</h1>
		<p class="text-[var(--text-secondary)] mb-6">
			{$page.error?.message ?? "The page you're looking for doesn't exist."}
		</p>
		<a
			href={urls.index}
			class="bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--primary)] border border-[var(--border)] px-6 py-3 rounded-lg transition-colors duration-200"
		>
			Go Home
		</a>
	</div>
</Shell>
