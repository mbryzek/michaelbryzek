import type { BlogSlug } from '#lib/data/blog.js';

export const urls = {
  index: '/',
  blog: '/blog',
  blogPost: (slug: BlogSlug) => `/blog/${slug}`,
  projects: '/projects',
  talks: '/talks',
  links: '/links'
};
