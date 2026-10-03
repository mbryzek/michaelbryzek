/**
 * @vitest-environment happy-dom
 *
 * The error page is what the static build emits as `404.html`, which the host
 * serves for every unknown path. It rendered no <Seo>, so that response carried
 * no <title> at all and the tab showed the bare URL. svelte-vitals' seo rules
 * cannot see it — the error page is not a route — so pin it here.
 */
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SITE_NAME } from '$lib/site';

const state = vi.hoisted(() => ({
  page: { url: new URL('http://localhost/nope'), status: 404, error: { message: 'Not Found' } as { message: string } | null }
}));

vi.mock('$app/state', () => state);

const ErrorPage = (await import('./+error.svelte')).default;

function mountErrorPage() {
  const component = mount(ErrorPage, { target: document.body });
  flushSync();
  return component;
}

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.title = '';
});

describe('error page head', () => {
  it('titles a 404 as a missing page', async () => {
    state.page.status = 404;
    const component = mountErrorPage();

    expect(document.title).toBe(`Page not found - ${SITE_NAME}`);
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();

    await unmount(component);
  });

  it('titles any other status as an error', async () => {
    state.page.status = 500;
    const component = mountErrorPage();

    expect(document.title).toBe(`Error - ${SITE_NAME}`);

    await unmount(component);
  });
});
