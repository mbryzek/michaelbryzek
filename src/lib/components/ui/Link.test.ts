/**
 * @vitest-environment happy-dom
 *
 * Two things are pinned here, and only the second one is about this component.
 *
 * `target="_blank"` without `rel="noopener"` hands the opened document a live
 * `window.opener` handle on this one, and a rooted path opened in a new tab
 * bypasses client-side routing and strands the visitor in a second tab of the
 * same site (#32, which was that bug). Neither is visible to the build,
 * svelte-check, eslint or any other test — a hand-written anchor that gets one
 * half wrong renders and passes. So the sweep below fails the suite the moment
 * a copy of those attributes reappears anywhere outside this file.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { svelteSources } from '$lib/testing/sources';

const Link = (await import('./Link.svelte')).default;

const SRC = 'src';
const OWNER = join('lib', 'components', 'ui', 'Link.svelte');

/** Every `<a ...>` open tag in `source`, attributes included. */
function anchorTags(source: string): string[] {
  return source.match(/<a\b[^>]*>/gs) ?? [];
}

function mountLink(props: { href: string; class?: string; ariaLabel?: string }) {
  const component = mount(Link, {
    target: document.body,
    props: {
      ...props,
      children: createRawSnippet(() => ({ render: () => '<span>label</span>' }))
    }
  });
  flushSync();
  return component;
}

const anchor = () => document.querySelector('a')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Link', () => {
  it('opens an off-origin href in a new tab without leaking the opener', () => {
    const component = mountLink({ href: 'https://rallyd.net' });

    expect(anchor().getAttribute('target')).toBe('_blank');
    expect(anchor().getAttribute('rel')).toBe('noopener noreferrer');

    unmount(component);
  });

  it('leaves a path on this site in the same tab', () => {
    const component = mountLink({ href: '/blog/managing-state-in-elm-single-page-apps' });

    expect(anchor().hasAttribute('target')).toBe(false);
    expect(anchor().hasAttribute('rel')).toBe(false);

    unmount(component);
  });

  it('leaves a mailto: href in the same tab', () => {
    const component = mountLink({ href: 'mailto:mbryzek@gmail.com' });

    expect(anchor().hasAttribute('target')).toBe(false);

    unmount(component);
  });

  it('passes class through, because the card CSS keys on it', () => {
    const component = mountLink({ href: 'https://rallyd.net', class: 'project' });

    expect(anchor().getAttribute('class')).toBe('project');

    unmount(component);
  });

  it('emits no class attribute when the call site passes none', () => {
    const component = mountLink({ href: 'https://rallyd.net' });

    expect(anchor().hasAttribute('class')).toBe(false);

    unmount(component);
  });

  it('passes ariaLabel through as aria-label for icon-only links', () => {
    const component = mountLink({ href: 'https://github.com/mbryzek', ariaLabel: 'GitHub' });

    expect(anchor().getAttribute('aria-label')).toBe('GitHub');

    unmount(component);
  });

  it('emits no aria-label when the call site passes none', () => {
    const component = mountLink({ href: 'https://rallyd.net' });

    expect(anchor().hasAttribute('aria-label')).toBe(false);

    unmount(component);
  });
});

describe('this component owns the new-tab decision', () => {
  const files = svelteSources(SRC).filter((path) => !path.endsWith(OWNER));

  it('finds the components to sweep', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)('%s hand-writes no target/rel on an anchor', (path) => {
    const source = readFileSync(path, 'utf8');

    for (const tag of anchorTags(source)) {
      expect(tag, `${path} hand-writes target on an <a>`).not.toMatch(/\btarget\s*=/);
      expect(tag, `${path} hand-writes rel on an <a>`).not.toMatch(/\brel\s*=/);
    }
  });

  it.each(files)('%s points no raw anchor off this origin', (path) => {
    const source = readFileSync(path, 'utf8');

    for (const tag of anchorTags(source)) {
      // The failure this catches is an off-origin <a> with no rel at all, which
      // the target/rel sweep above cannot see.
      expect(tag, `${path} links off-origin from a raw <a> — use ui/Link.svelte`).not.toMatch(/href\s*=\s*["']https?:/);
    }
  });
});
