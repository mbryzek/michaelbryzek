<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import { blogPosts } from '$lib/data/blog';
	import { urls } from '$lib/urls';
</script>

<Shell title="Blog">
	<div class="space-y-6">
		{#each blogPosts as post}
			<a href={urls.blogPost(post.slug)} class="block group focus:outline-none">
				<div
					class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:bg-[var(--bg-hover)] hover:shadow-lg transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--bg-base)]"
				>
					<h2
						class="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-200 mb-2"
					>
						{post.title}
					</h2>
					<p class="text-[var(--text-tertiary)] text-sm">{post.date}</p>
				</div>
			</a>
		{/each}
	</div>
</Shell>
