/**
 * `--ring` says what the site's keyboard focus indicator looks like, and it has
 * always been declared once. What was written out six times, under six
 * different selectors, was the pair that APPLIES it:
 *
 *     outline: none;
 *     box-shadow: var(--ring);
 *
 * So what actually decided whether an interactive element showed a focus ring
 * was whether somebody remembered to write those two lines — and the first half
 * makes getting it half-right worse than forgetting it entirely, because
 * `outline: none` on its own REMOVES the browser's default focus indicator and
 * puts nothing back, leaving a control with no visible focus at all. One of the
 * six copies had already been re-derived inside a component's scoped <style>,
 * where nothing in the stylesheet could reach it (ISS-4560).
 *
 * Nothing else here can see that. It is pure CSS — invisible to svelte-check,
 * to eslint and to prettier — and invisible in any screenshot taken with a
 * mouse. So pin the mechanism rather than the six sites: one rule applies the
 * ring, and anything else that writes `outline: none` or reads `var(--ring)` is
 * a second copy by definition.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ruleBlockBody } from '$lib/testing/regex';

const APPLIER = '.focus-ring:focus-visible';
const APP_CSS = 'src/app.css';

/**
 * Every component in the tree, as text. `import.meta.glob` is vite's own read of
 * the source tree, so this needs no directory walk of its own and picks up a
 * component added later without anyone touching this test. The stylesheet is
 * read directly because the tailwind plugin owns `.css` and hands back nothing
 * for one globbed `?raw`; vitest runs from the repo root.
 */
const COMPONENTS = import.meta.glob('./**/*.svelte', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

/**
 * Path → text, comments removed. A rule and a comment describing one read the
 * same to a regex, and the stylesheet explains this mechanism in prose right
 * above it.
 */
const SOURCES: Record<string, string> = Object.fromEntries(
  [
    [APP_CSS, readFileSync(join(process.cwd(), APP_CSS), 'utf8')] as const,
    ...Object.entries(COMPONENTS).map(([path, text]) => [path.replace('./', 'src/'), text] as const)
  ].map(([path, text]) => [path, text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '')])
);

/** The paths whose text matches `pattern`, so a failure names the file. */
const sourcesMatching = (pattern: RegExp): string[] =>
  Object.entries(SOURCES)
    .filter(([, text]) => pattern.test(text))
    .map(([path]) => path);

const appCss = (): string => {
  const text = SOURCES[APP_CSS];
  if (text === undefined) throw new Error(`no ${APP_CSS} in the source tree`);
  return text;
};

describe('the focus ring is applied in one place', () => {
  it('declares the ring and the outline it replaces together, under one selector', () => {
    const body = ruleBlockBody(appCss(), APPLIER);

    expect(body).toMatch(/outline:\s*none/);
    expect(body).toMatch(/box-shadow:\s*var\(--ring\)/);
  });

  it('is the only rule in the tree that suppresses the browser focus outline', () => {
    // `outline: none` without the ring is the failure mode: it removes the
    // browser's indicator and puts nothing back, on a control that goes on
    // looking fine to everyone using a mouse.
    expect(sourcesMatching(/outline:\s*(none|0)\b/)).toEqual([APP_CSS]);
    expect(appCss().match(/outline:\s*(?:none|0)\b/g)).toHaveLength(1);
  });

  it('is the only rule in the tree that reads --ring', () => {
    expect(sourcesMatching(/var\(--ring\)/)).toEqual([APP_CSS]);
    expect(appCss().match(/var\(--ring\)/g)).toHaveLength(1);
  });

  it('is the only :focus-visible rule in the tree', () => {
    // A second one is not automatically wrong, but it is a decision — either it
    // wants this ring, in which case it wants this class, or it wants a
    // different one, which belongs beside this rule and not in a component.
    const declared = Object.values(SOURCES).flatMap((text) => text.match(/[^\s{,]*:focus-visible/g) ?? []);

    expect(declared).toEqual([APPLIER]);
  });

  it('is applied from the markup, so it reaches components with scoped styles', () => {
    const users = sourcesMatching(/class=("[^"]*\bfocus-ring\b|\{[^}]*\bfocus-ring\b)/);

    expect(users.every((path) => path.endsWith('.svelte'))).toBe(true);
    expect(users.length).toBeGreaterThan(1);
  });

  it('keeps that rule last in the stylesheet, where source order cannot lose the ring', () => {
    // `.focus-ring:focus-visible` and `.project:hover` both have specificity
    // (0,2,0) and both set `box-shadow`, and an element can be keyboard-focused
    // and hovered at the same time — so a rule appended below this one silently
    // takes the ring away from that element.
    const css = appCss();
    const start = css.indexOf(APPLIER);
    expect(start, `no ${APPLIER} rule`).toBeGreaterThan(-1);

    const afterTheRule = css.slice(start).split('}').slice(1).join('}');
    expect(afterTheRule.trim(), 'a rule was appended below the focus-ring rule').toBe('');
  });
});

/**
 * `ui/Link.svelte` applies the class itself, so its own anchor carries no
 * literal `focus-ring` in the tag and every `<Link>` call site is covered
 * without one. `Link.test.ts` pins that by mounting the component.
 */
const RING_OWNER = 'src/lib/components/ui/Link.svelte';

/** Every `<a ...>` and `<button ...>` open tag in `source`, attributes included. */
const focusableTags = (source: string): string[] => source.match(/<(?:a|button)\b[^>]*>/gs) ?? [];

/** `class="... focus-ring ..."`, or the same inside a `{...}` expression. */
const CARRIES_RING = /class=(?:"[^"]*\bfocus-ring\b|\{[^}]*\bfocus-ring\b)/;

/**
 * `tabindex="-1"` takes an element out of the tab order, so no keyboard press
 * can ever put `:focus-visible` on it and there is no ring to be missing. The
 * mobile menu's overlay and its panel are both that: click targets and focus
 * containers, sized to the viewport, where a ring would be wrong even if one
 * could be drawn.
 */
const NOT_TABBABLE = /tabindex=(?:"-1"|'-1'|\{-1\})/;

describe('every element a keyboard can reach opts in', () => {
  const markup = Object.entries(SOURCES).filter(([path]) => path.endsWith('.svelte') && path !== RING_OWNER);

  it('finds the components to sweep', () => {
    // A walk that quietly returned nothing would turn this suite green with the
    // guard gone.
    expect(markup.length).toBeGreaterThan(10);
  });

  it.each(markup)('%s rings every anchor and button it writes by hand', (path, source) => {
    for (const tag of focusableTags(source)) {
      if (NOT_TABBABLE.test(tag)) continue;

      expect(tag, `${path} writes a focusable element with no focus-ring — it will show the browser outline instead`).toMatch(CARRIES_RING);
    }
  });
});
