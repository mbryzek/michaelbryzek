import type { BlogSlug } from '$lib/data/blog';

export const urls = {
  index: '/',
  blog: '/blog',
  blogPost: (slug: BlogSlug) => `/blog/${slug}`,
  projects: '/projects',
  talks: '/talks',
  links: '/links'
};
