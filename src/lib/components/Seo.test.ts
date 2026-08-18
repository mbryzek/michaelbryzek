/**
 * @vitest-environment happy-dom
 *
 * `SITE_NAME` used to govern `og:site_name` and nothing else: every `<title>`
 * on the site spelled the same name out again as a literal, in every caller, so
 * the one token that looked like the control over the site's name was not one.
 * The separator was the same trap a level down — five callers happened to agree
 * on `' - '` and nothing enforced it, which makes a sixth written with an en
 * dash correct-looking on the page and invisible in review.
 *
 * So pin both halves: this component composes the document title from
 * `SITE_NAME`, and no page hands it a title that spells the name out again.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SITE_NAME } from '$lib/site';
import { captures } from '$lib/testing/regex';

vi.mock('$app/state', () => ({
  page: { url: new URL('http://localhost/projects') }
}));

const Seo = (await import('./Seo.svelte')).default;

// vitest runs from the repo root.
const ROUTES = join(process.cwd(), 'src', 'routes');

function svelteFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return svelteFiles(path);
    return entry.isFile() && entry.name.endsWith('.svelte') ? [path] : [];
  });
}

/**
 * The `title` attribute of every `<Seo ...>` tag in `source`. Only that
 * attribute — a `description` names the site in ordinary prose, which is not
 * this rule.
 */
const seoTitles = (source: string): string[] =>
  (source.match(/<Seo\b[^>]*>/gs) ?? []).flatMap((tag) => captures(tag, /\btitle=("[^"]*"|\{[^}]*\})/g));

function mountSeo(props: { title: string; description: string; nameFirst?: boolean }) {
  const component = mount(Seo, { target: document.body, props });
  flushSync();
  return component;
}

const metaContent = (selector: string) => document.head.querySelector(selector)?.getAttribute('content');

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.title = '';
});

describe('Seo title composition', () => {
  it('appends the site name to the page title', () => {
    const component = mountSeo({ title: 'Projects', description: 'd' });

    expect(document.title).toBe(`Projects - ${SITE_NAME}`);

    unmount(component);
  });

  it('leads with the site name when the page asks for it', () => {
    const component = mountSeo({ title: 'Developer & Entrepreneur', description: 'd', nameFirst: true });

    expect(document.title).toBe(`${SITE_NAME} - Developer & Entrepreneur`);

    unmount(component);
  });

  it('gives og:title and twitter:title the same composed title as the tab', () => {
    const component = mountSeo({ title: 'Talks', description: 'd' });

    expect(metaContent('meta[property="og:title"]')).toBe(document.title);
    expect(metaContent('meta[name="twitter:title"]')).toBe(document.title);

    unmount(component);
  });

  it('names the site once, from the same token, in og:site_name', () => {
    const component = mountSeo({ title: 'Links', description: 'd' });

    expect(metaContent('meta[property="og:site_name"]')).toBe(SITE_NAME);

    unmount(component);
  });
});

describe('this component owns the site name in the title', () => {
  // Repo-relative, so a failure names the file the way you would open it.
  const files = svelteFiles(ROUTES).map((path) => relative(process.cwd(), path));

  it('finds the pages to sweep', () => {
    expect(files.filter((path) => seoTitles(readFileSync(path, 'utf8')).length > 0).length).toBeGreaterThan(4);
  });

  it.each(files)('%s passes Seo a title that does not spell the site name out', (path) => {
    for (const title of seoTitles(readFileSync(path, 'utf8'))) {
      expect(title, `${path} repeats the site name in a <Seo> title — Seo.svelte appends it`).not.toContain(SITE_NAME);
    }
  });

  it.each(files)('%s writes no <title> of its own', (path) => {
    expect(readFileSync(path, 'utf8'), `${path} sets a document title outside Seo.svelte`).not.toMatch(/<title\b/);
  });
});
