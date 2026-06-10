<script lang="ts">
	import { page } from '$app/stores';
	import Shell from '$lib/components/Shell.svelte';
	import { urls } from '$lib/urls';
</script>

<Shell>
	<div class="flex flex-col items-center justify-center text-center py-16">
		<p class="error-status">{$page.status}</p>
		<p class="error-message">
			{$page.error?.message ?? "The page you're looking for doesn't exist."}
		</p>
		<a class="btn" href={urls.index}>Go home</a>
	</div>
</Shell>

<style>
	.error-status {
		font-size: var(--text-4xl);
		font-weight: var(--fw-bold);
		letter-spacing: var(--tracking-tight);
		color: var(--text);
		margin: 0 0 var(--space-3);
	}
	.error-message {
		font-size: var(--text-md);
		color: var(--text-muted);
		margin: 0 0 var(--space-6);
	}
</style>
