/**
 * @vitest-environment happy-dom
 *
 * The palette and the toggle icon each decide what "no `data-theme` attribute"
 * means, and for a while they disagreed: the icon treated it as dark (sun, i.e.
 * "switch to light") while `:root` carried the LIGHT tokens. Every normal page
 * load hides that, because the inline script in `+layout.svelte` stamps the
 * attribute on before first paint — so the only visitors who ever saw it were
 * the ones with JS disabled, or behind a CSP that forbids inline script, who got
 * a light page whose one theme control offered to switch to light.
 *
 * Nothing else here can catch that. It is pure cascade, invisible to
 * svelte-check and to every screenshot taken with JS on, and each half of it
 * reads as correct on its own — you have to compare the two to see it. So pin
 * both halves and, above all, that they agree.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');

const appCss = read('../../app.css');
const themeToggle = read('./ThemeToggle.svelte');

/** The custom-property names declared inside the first `<selector> { ... }` block. */
function tokenNamesIn(selector: string): string[] {
  const block = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(appCss);
  expect(block, `no rule block for ${selector}`).not.toBeNull();
  const names = [...block![1].matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]);
  expect(names.length, `no tokens in ${selector}`).toBeGreaterThan(10);
  return names;
}

// Derived from the stylesheet rather than hardcoded, so a token added later is
// covered without anyone remembering to add it here.
const THEME_TOKENS = tokenNamesIn("[data-theme='light']");

/** What the browser actually resolves on <html>, cascade and source order included. */
function paletteFor(theme: string | null): Record<string, string> {
  if (theme === null) document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);

  const computed = getComputedStyle(document.documentElement);
  return Object.fromEntries([
    ['color-scheme', computed.getPropertyValue('color-scheme').trim()],
    ...THEME_TOKENS.map((name) => [name, computed.getPropertyValue(name).trim()])
  ]);
}

beforeEach(() => {
  document.head.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  const style = document.createElement('style');
  style.textContent = appCss;
  document.head.appendChild(style);
});

describe('theme palette fallback', () => {
  it('renders the dark palette when no data-theme attribute is set', () => {
    // The no-JS case. Asserted against the dark block itself rather than against
    // literal hex values, so it keeps holding when the palette is retuned.
    expect(paletteFor(null)).toEqual(paletteFor('dark'));
    expect(paletteFor(null)['color-scheme']).toBe('dark');
  });

  it('still lets an explicit light choice win over :root', () => {
    // `:root` and `[data-theme='light']` have equal specificity, so this passes
    // only while the light block stays BELOW the dark one in app.css. Moving it
    // up is the silent way to undo the fix and leave every light-mode visitor
    // on the dark palette.
    const light = paletteFor('light');

    expect(light['color-scheme']).toBe('light');
    expect(light).not.toEqual(paletteFor('dark'));
  });

  it('gives light and dark the same set of tokens, none left unresolved', () => {
    // A token declared in one block and forgotten in the other inherits from the
    // shared :root block above — or resolves to nothing at all, which paints as
    // an unstyled element rather than as an error.
    for (const [name, value] of Object.entries(paletteFor('light'))) {
      expect(value, `${name} is empty under [data-theme='light']`).not.toBe('');
    }
    for (const [name, value] of Object.entries(paletteFor('dark'))) {
      expect(value, `${name} is empty under [data-theme='dark']`).not.toBe('');
    }
  });
});

describe('theme toggle icon fallback', () => {
  // Svelte scopes these rules at compile time and vitest never applies them, so
  // read the source: what matters is which attribute state each rule keys off.
  const iconRules = /<style>([\s\S]*)<\/style>/.exec(themeToggle);

  it('shows the sun — "switch to light" — when no data-theme attribute is set', () => {
    expect(iconRules).not.toBeNull();
    const css = iconRules![1];

    // The moon is hidden unconditionally and revealed only under light, so the
    // sun is what an attribute-less document paints. That is the dark-mode icon,
    // which is the same answer the palette gives above — the agreement is the
    // whole point of this file.
    expect(css).toMatch(/\.icon-moon\s*\{\s*display:\s*none/);
    expect(css).toMatch(/html\[data-theme='light'\]\)\s*\.icon-sun\s*\{\s*display:\s*none/);
    expect(css).toMatch(/html\[data-theme='light'\]\)\s*\.icon-moon\s*\{\s*display:\s*block/);

    // Nothing may key the icons off [data-theme='dark']: that would make the
    // attribute-less case fall through to neither icon, or to both.
    expect(css).not.toMatch(/data-theme='dark'/);
  });

  it('reads the live attribute rather than assuming a starting theme', () => {
    // `getAttribute(...) === 'light' ? 'dark' : 'light'` treats the absent
    // attribute as dark, matching the palette. Inverting the comparison would
    // make the first click on a no-JS-rendered page a no-op.
    expect(themeToggle).toMatch(/getAttribute\('data-theme'\) === 'light' \? 'dark' : 'light'/);
  });
});
