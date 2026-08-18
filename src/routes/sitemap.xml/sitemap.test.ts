import { describe, expect, it } from 'vitest';
import { blogPosts } from '$lib/data/blog';
import { absoluteUrl } from '$lib/site';
import { urls } from '$lib/urls';
import { captures } from '$lib/testing/regex';
import { GET } from './+server';

/**
 * The sitemap replaced a static file that hand-duplicated every route and slug,
 * "so a new blog post was silently absent from it with nothing to catch the
 * omission" — its own words. The blog half of that is genuinely fixed: the slugs
 * are mapped straight off `blogPosts`. The five static routes are still written
 * out by hand, so the identical omission is still available one `urls` entry at
 * a time, and it fails the same way: silently, in a file nobody opens, degrading
 * search indexing rather than breaking a page.
 *
 * So pin the direction that matters — every route the site has is a route the
 * sitemap lists. `urls` is the site's own inventory of them, which makes it the
 * thing to compare against.
 */
const loc = (path: string) => `<loc>${absoluteUrl(path)}</loc>`;

async function sitemapBody(): Promise<string> {
  return await GET().text();
}

/** Every url the sitemap lists. */
const locsIn = (body: string): string[] => captures(body, /<loc>([^<]+)<\/loc>/g);

describe('sitemap', () => {
  it('lists every static route in urls', async () => {
    const body = await sitemapBody();

    // Everything in `urls` except `blogPost`, which takes a slug and is covered
    // by the per-post assertion below.
    const staticPaths = Object.values(urls).filter((value) => typeof value === 'string');
    const missing = staticPaths.filter((path) => !body.includes(loc(path)));

    expect(missing).toEqual([]);
  });

  it('lists every blog post', async () => {
    const body = await sitemapBody();
    const missing = blogPosts.filter((post) => !body.includes(loc(urls.blogPost(post.slug)))).map((post) => post.slug);

    expect(missing).toEqual([]);
  });

  it('lists nothing twice', async () => {
    const body = await sitemapBody();
    const locs = locsIn(body);

    expect(locs).toEqual([...new Set(locs)]);
  });

  it('lists nothing beyond the routes and the posts', async () => {
    const body = await sitemapBody();
    const locs = locsIn(body);

    const expected = [
      ...Object.values(urls)
        .filter((value) => typeof value === 'string')
        .map((path) => absoluteUrl(path)),
      ...blogPosts.map((post) => absoluteUrl(urls.blogPost(post.slug)))
    ];

    expect([...locs].sort()).toEqual([...expected].sort());
  });

  it('serves absolute urls, which the sitemap protocol requires', async () => {
    const body = await sitemapBody();
    const locs = locsIn(body);

    expect(locs.length).toBeGreaterThan(0);
    expect(locs.filter((url) => !url.startsWith('https://'))).toEqual([]);
  });

  it('declares xml content type', async () => {
    expect(GET().headers.get('Content-Type')).toBe('application/xml');
  });
});
