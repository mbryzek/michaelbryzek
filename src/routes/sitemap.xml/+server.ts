import { blogPosts } from '$lib/data/blog';
import { absoluteUrl } from '$lib/site';
import { urls } from '$lib/urls';

export const prerender = true;

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: string;
}

// Generated from the same data the site renders from. The previous static
// sitemap.xml hand-duplicated every route and slug, so a new blog post was
// silently absent from it with nothing to catch the omission.
const entries: SitemapEntry[] = [
  { path: urls.index, changefreq: 'monthly', priority: '1.0' },
  { path: urls.blog, changefreq: 'weekly', priority: '0.8' },
  ...blogPosts.map((post) => ({ path: urls.blogPost(post.slug), changefreq: 'monthly', priority: '0.7' })),
  { path: urls.projects, changefreq: 'monthly', priority: '0.8' },
  { path: urls.talks, changefreq: 'monthly', priority: '0.8' },
  { path: urls.links, changefreq: 'monthly', priority: '0.6' }
];

export function GET(): Response {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
