<script lang="ts">
  import Shell from '$lib/components/Shell.svelte';
  import { blogPosts } from '$lib/data/blog';
  import { urls } from '$lib/urls';
</script>

<svelte:head>
  <title>Blog - Michael Bryzek</title>
  <meta name="description" content="Blog posts by Michael Bryzek on software engineering, Elm, and building products." />
</svelte:head>

<Shell title="Blog">
  <div class="post-list">
    {#each blogPosts as post}
      <a class="post" href={urls.blogPost(post.slug)}>
        <span class="date">{post.date}</span>
        <p class="post-title">{post.title}</p>
      </a>
    {/each}
  </div>
</Shell>
