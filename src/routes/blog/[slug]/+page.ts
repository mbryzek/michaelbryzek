import type { EntryGenerator, PageLoad } from './$types';
import { blogPosts, findPost } from '$lib/data/blog';
import { error } from '@sveltejs/kit';

// Prerender one page per post. Without this the adapter only finds the posts
// that happen to be linked from /blog, so a post reachable by URL alone would
// silently be missing from the static build.
export const entries: EntryGenerator = () => blogPosts.map((post) => ({ slug: post.slug }));

export const load: PageLoad = ({ params }) => {
  const post = findPost(params.slug);

  if (!post) {
    throw error(404, 'Blog post not found');
  }

  return {
    post
  };
};
