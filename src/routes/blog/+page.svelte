<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import { blogPosts } from '$lib/data/blog';
	import { urls } from '$lib/urls';
</script>

<Shell>
	<div class="space-y-6">
		{#each blogPosts as post}
			<div class="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
				<a href={urls.blogPost(post.slug)} class="block">
					<h2 class="text-xl font-semibold text-gray-100 mb-2">{post.title}</h2>
					<p class="text-gray-400 text-sm italic">{post.date}</p>
				</a>
			</div>
		{/each}
	</div>
</Shell>
