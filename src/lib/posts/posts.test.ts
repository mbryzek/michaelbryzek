import { describe, expect, it } from 'vitest';
import { blogPosts } from '$lib/data/blog';
import { postComponents } from './index';

/**
 * `Record<BlogSlug, Component<PostProps>>` already makes a missing post a
 * compile error. This is the runtime half of the same invariant: it survives a
 * future `as` cast or a widening of `BlogSlug`, and it fails with the offending
 * slug named rather than with a blank page in production.
 */
describe('post components', () => {
  it('has one for every blog post', () => {
    const missing = blogPosts.filter((post) => postComponents[post.slug] === undefined).map((post) => post.slug);
    expect(missing).toEqual([]);
  });

  it('has none that no blog post points at', () => {
    const slugs = new Set<string>(blogPosts.map((post) => post.slug));
    const orphans = Object.keys(postComponents).filter((slug) => !slugs.has(slug));
    expect(orphans).toEqual([]);
  });
});
