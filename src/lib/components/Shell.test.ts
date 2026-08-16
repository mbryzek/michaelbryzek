/**
 * @vitest-environment happy-dom
 *
 * The scroll lock has now been wrong twice: first it was set on <body>, where
 * `html { overflow-y: scroll }` meant it did nothing at all (#41), and then —
 * once it worked — it outlived the component that set it. <html> is shared by
 * every page while each route mounts its own <Shell>, so a history navigation
 * with the panel open left the site permanently unscrollable and Escape could
 * not free it, because the remounted Shell no longer believed the menu was open.
 *
 * Both defects are invisible to a type check and to every other test here, and
 * neither shows up on the page that has the bug — you only see it one navigation
 * later. So pin the lifecycle: locked while open, released when closed, and
 * released when the component goes away no matter which of those it was doing.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/state', () => ({
  page: { url: new URL('http://localhost/projects') }
}));

const Shell = (await import('./Shell.svelte')).default;

const rootOverflow = () => document.documentElement.style.overflow;
const menuButton = () => document.querySelector<HTMLButtonElement>('button[aria-label="Toggle menu"]');

function mountShell() {
  const component = mount(Shell, {
    target: document.body,
    props: {
      children: createRawSnippet(() => ({ render: () => '<p>content</p>' }))
    }
  });
  flushSync();
  return component;
}

function openMenu() {
  menuButton()?.click();
  flushSync();
}

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.style.overflow = '';
});

describe('Shell mobile menu scroll lock', () => {
  it('leaves the page scrollable while the menu is closed', () => {
    const component = mountShell();
    expect(rootOverflow()).toBe('');
    unmount(component);
  });

  it('locks the root element — not body — while the menu is open', () => {
    const component = mountShell();
    openMenu();

    expect(rootOverflow()).toBe('hidden');
    // The <body> lock is the idiom that silently did nothing here (#41): keep it
    // untouched so a future edit cannot quietly go back to it and still pass.
    expect(document.body.style.overflow).toBe('');

    unmount(component);
  });

  it('releases the lock when the menu is closed again', () => {
    const component = mountShell();
    openMenu();
    openMenu();

    expect(rootOverflow()).toBe('');
    unmount(component);
  });

  it('releases the lock when the component is destroyed with the menu still open', () => {
    const component = mountShell();
    openMenu();
    expect(rootOverflow()).toBe('hidden');

    // What a history navigation does: the instance holding the lock is torn down
    // without either close handler running.
    unmount(component);
    flushSync();

    expect(rootOverflow()).toBe('');
  });

  it('does not inherit a lock left behind on the root element', () => {
    // Belt and braces for the same navigation: even if an instance were torn
    // down without its teardown running, the next page's Shell clears the root
    // rather than trusting whatever it found there.
    document.documentElement.style.overflow = 'hidden';

    const component = mountShell();

    expect(rootOverflow()).toBe('');
    unmount(component);
  });
});

/**
 * The panel's close control is the hamburger, and the hamburger is inside
 * `.topbar` — so the bar has to paint above the panel or there is no way to shut
 * the menu. It did not: `.topbar` is a stacking context (sticky + z-index, and
 * again via `backdrop-filter`), which scopes the button's own z-index inside the
 * bar and leaves the bar's 50 to compete with the panel's 1000. Under 641px the
 * panel is full-width and full-height, so it covered the tap-outside overlay as
 * well and the only exits left were Escape — no such key on a phone — and
 * navigating away via a link.
 *
 * Nothing else here can see this: it is pure layout, invisible to svelte-check
 * and to a DOM without a layout engine, and it looks like a working menu in
 * every screenshot that does not try to close one. So pin the ordering itself.
 * Formatting is safe to parse against because `prettier --check` gates CI.
 */
describe('mobile menu layering', () => {
  const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');

  /** The `z-index` declared in the first `<selector> { ... }` block found. */
  function zIndexOf(css: string, selector: string): number {
    const block = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(css);
    expect(block, `no rule block for ${selector}`).not.toBeNull();
    const declaration = /z-index:\s*(\d+)/.exec(block![1]);
    expect(declaration, `no z-index in ${selector}`).not.toBeNull();
    return Number(declaration![1]);
  }

  it('paints the top bar above the panel, and the panel above its overlay', () => {
    const shell = read('./Shell.svelte');
    const appCss = read('../../app.css');

    const topbar = zIndexOf(appCss, '.topbar');
    const panel = zIndexOf(shell, '.mobile-menu');
    const overlay = zIndexOf(shell, '.mobile-menu-overlay');

    expect(topbar).toBeGreaterThan(panel);
    expect(panel).toBeGreaterThan(overlay);
  });

  it('does not put a z-index on the hamburger, which cannot escape the bar', () => {
    // A z-index here is not merely redundant, it is misleading: it reads as
    // "this button is above the panel" while the bar's own value is what decides.
    const button = /\.mobile-menu-button\s*\{([^}]*)\}/.exec(read('./Shell.svelte'));
    expect(button).not.toBeNull();
    expect(button![1]).not.toMatch(/z-index/);
  });
});
