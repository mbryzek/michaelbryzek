<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { blogPosts } from '$lib/data/blog';
  import { urls } from '$lib/urls';
</script>

<Seo title="Blog" description="Blog posts by Michael Bryzek on software engineering, Elm, and building products." />

<Shell title="Blog">
  <div class="post-list">
    {#each blogPosts as post}
      <a class="post focus-ring" href={urls.blogPost(post.slug)}>
        <span class="date">{post.date}</span>
        <p class="post-title">{post.title}</p>
      </a>
    {/each}
  </div>
</Shell>
