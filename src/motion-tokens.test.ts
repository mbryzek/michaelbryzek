/**
 * Motion is one duration and one curve, said once in the token block and read
 * everywhere (ISS-4561).
 *
 * `--dur`, `--dur-fast` and `--ease` in `src/app.css` are the site's motion
 * entries, and the mobile chrome bypassed all three: the hamburger morph, the
 * overlay fade and the panel slide each spelled `0.3s ease` inline, seventeen
 * lines above a rule in the same style block that read the tokens correctly. So
 * the panel animated at 300ms on the browser default curve while `.mobile-link`
 * — inside that same sliding panel — animated at 200ms on the site's own. Editing
 * `--dur` retuned the whole site and left the menu where it was.
 *
 * Nothing else here sees that. A literal duration type checks, lints, formats and
 * renders; it is only wrong the day somebody retunes the token and believes it
 * took, and it looks like a working menu in any screenshot. So pin the direction
 * of the dependency across every stylesheet and component at once, not the
 * milliseconds, and not only the file that had the bug — the next component
 * writing its own `0.3s` is the same defect one file over.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const src = new URL('./', import.meta.url);

/** Every `.css` and `.svelte` file under `src/`, as `[path relative to src, text]`. */
function stylesheets(): [string, string][] {
  return readdirSync(fileURLToPath(src), { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.css') || name.endsWith('.svelte'))
    .sort()
    .map((name) => [name, readFileSync(fileURLToPath(new URL(name, src)), 'utf8')]);
}

/**
 * `css` with every `@media (prefers-reduced-motion: reduce)` block removed.
 *
 * That block is the one place a literal belongs: it is a kill switch that turns
 * motion off for everyone who asked for less of it, so its `none` and its
 * near-zero duration are not a choice of timing and have no token to read.
 */
function withoutReducedMotion(css: string): string {
  let out = '';
  let rest = css;
  for (;;) {
    const at = rest.search(/@media\s*\(\s*prefers-reduced-motion/);
    if (at === -1) return out + rest;
    out += rest.slice(0, at);
    let depth = 0;
    let i = rest.indexOf('{', at);
    for (; i < rest.length; i++) {
      if (rest[i] === '{') depth++;
      else if (rest[i] === '}' && --depth === 0) break;
    }
    rest = rest.slice(i + 1);
  }
}

interface Declaration {
  file: string;
  text: string;
  /** The declared value with every `var(--token)` reference removed. */
  literal: string;
}

function transitionDeclarations(): Declaration[] {
  return stylesheets().flatMap(([file, text]) =>
    [...withoutReducedMotion(text).matchAll(/transition(?:-duration|-delay|-timing-function)?:\s*([^;}]+)/g)].map((match) => ({
      file,
      text: `${match[0]!.replace(/\s+/g, ' ').trim()};`,
      literal: match[1]!.replace(/var\(\s*--[^)]*\)/g, '')
    }))
  );
}

describe('motion has one source of truth', () => {
  it('finds the transitions it is guarding', () => {
    // Every assertion below passes vacuously on an empty list, and the regex that
    // builds it is the kind of thing a formatting change can silently defeat.
    expect(transitionDeclarations().length).toBeGreaterThan(10);
  });

  it('states every duration as a token, never a literal', () => {
    const literals = transitionDeclarations()
      .filter((declaration) => /\d/.test(declaration.literal))
      .map((declaration) => `${declaration.file}: ${declaration.text}`);

    expect(literals).toEqual([]);
  });

  it('states every curve as a token, never a bare timing function', () => {
    const curves = /\b(?:ease(?:-in)?(?:-out)?|linear|step-start|step-end|cubic-bezier|steps)\b/;
    const bare = transitionDeclarations()
      .filter((declaration) => curves.test(declaration.literal))
      .map((declaration) => `${declaration.file}: ${declaration.text}`);

    expect(bare).toEqual([]);
  });

  it('reads only motion tokens that app.css defines', () => {
    // A `var(--duraton)` resolves to nothing and the transition falls back to 0s,
    // which is a typo that renders as "the animation is gone" and type checks.
    const appCss = readFileSync(fileURLToPath(new URL('./app.css', src)), 'utf8');
    const defined = new Set([...appCss.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1]!));

    const referenced = new Set(
      transitionDeclarations().flatMap((declaration) => [...declaration.text.matchAll(/var\(\s*(--[\w-]+)/g).map((match) => match[1]!)])
    );

    expect([...referenced].filter((token) => !defined.has(token))).toEqual([]);
    expect(referenced).toContain('--dur');
    expect(referenced).toContain('--ease');
  });
});
