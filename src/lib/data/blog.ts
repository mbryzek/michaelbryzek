import type { BlogPost } from '$lib/types';

export const blogPosts = [
  {
    slug: 'managing-state-in-elm-single-page-applications',
    title: 'Managing State in Elm Single Page Applications',
    date: 'March 2025'
  },
  {
    slug: 'motivation-behind-true-acumen',
    title: 'Motivation for True Acumen',
    date: 'January 2025'
  }
] as const satisfies readonly BlogPost[];

/**
 * The slugs that actually have a post, derived from the data above. Anything
 * that links to a post takes this type, so renaming a slug is a compile error
 * at every reference instead of a silent 404 in production.
 */
export type BlogSlug = (typeof blogPosts)[number]['slug'];

/**
 * One entry of `blogPosts`, with its `slug` narrowed to the literal rather than
 * widened back to `string` by the `BlogPost` interface. `findPost` returns this
 * so a caller can index a `Record<BlogSlug, ...>` with the slug it found.
 */
export type BlogPostEntry = (typeof blogPosts)[number];

export function findPost(slug: string): BlogPostEntry | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
