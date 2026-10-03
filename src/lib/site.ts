/**
 * Canonical origin for this site. Absolute URLs are required by canonical
 * links, Open Graph and the sitemap, none of which may use a relative path.
 */
export const SITE_URL = 'https://bryzek.com';

export const SITE_NAME = 'Michael Bryzek';

/**
 * The document title: the page's own part with the site name appended, or,
 * for the home page, leading. The only place the name and the separator are
 * spelled, so every `<title>` on the site agrees on both.
 */
export function documentTitle(title: string, nameFirst = false): string {
  return nameFirst ? `${SITE_NAME} - ${title}` : `${title} - ${SITE_NAME}`;
}

/** `path` is always a rooted path ('/', '/blog', '/blog/<slug>'). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * True when `url` points off this origin. `blogUrl` and the nav are rooted
 * paths on this site; a project's website and GitHub links are absolute. Only
 * the latter open in a new tab — see `ui/Link.svelte`, the one anchor that
 * reads this.
 */
export function isExternal(url: string): boolean {
  return url.startsWith('http');
}
