/**
 * Canonical origin for this site. Absolute URLs are required by canonical
 * links, Open Graph and the sitemap, none of which may use a relative path.
 */
export const SITE_URL = 'https://bryzek.com';

export const SITE_NAME = 'Michael Bryzek';

/** `path` is always a rooted path ('/', '/blog', '/blog/<slug>'). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
