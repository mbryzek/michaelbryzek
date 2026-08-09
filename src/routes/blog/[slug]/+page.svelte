<script lang="ts">
  import type { PageData } from './$types';
  import Shell from '$lib/components/Shell.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { postComponents } from '$lib/posts';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const Post = $derived(postComponents[data.post.slug]);
</script>

<Seo title="{data.post.title} - Michael Bryzek" description="Blog post by Michael Bryzek: {data.post.title}" />

<Shell>
  <Post title={data.post.title} date={data.post.date} />
</Shell>
