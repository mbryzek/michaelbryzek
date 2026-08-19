/**
 * How big an icon renders was decided in ten places across two mechanisms and
 * three values, and they had already drifted: `.foot .socials svg` sized the
 * footer socials at 17px, silently overriding the 18px the very same components
 * declare on themselves, so `GithubIcon` rendered a pixel smaller in the footer
 * than in a project card (ISS-4557).
 *
 * That override wins for two independent reasons — `src/app.css` is unlayered
 * while Tailwind's utilities sit in a cascade layer, and a descendant selector
 * outranks a single class anyway — which is why the fix is a mechanism rather
 * than a corrected number: exactly one rule gives an svg a size, and a container
 * that wants a different one rebinds `--icon-size` on itself.
 *
 * Nothing else here can catch a relapse. A `<container> svg { width: 20px }`
 * type checks, lints, formats and renders as a perfectly good icon in any
 * screenshot that does not put the two sizes side by side. So pin the direction
 * of the dependency, not the pixels.
 */
import { describe, expect, it } from 'vitest';
import { ruleBlockBody } from '$lib/testing/regex';
import { readSource, readSourceDir } from '$lib/testing/source';

const appCss = readSource(import.meta.url, '../../../app.css');
const iconComponents = readSourceDir(import.meta.url, '.', '.svelte');
const themeToggle = readSource(import.meta.url, '../ThemeToggle.svelte');

/**
 * Every innermost `<selector> { ... }` block in `css`.
 *
 * `[^{}]*` for the body is what makes it innermost: an `@media` prelude cannot
 * match, because its contents hold a brace, so a rule nested inside one is
 * returned under its own selector and the at-rule itself is skipped.
 */
function ruleBlocks(css: string): { selector: string; body: string }[] {
  return [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: (match[1] ?? '').trim().replace(/\s+/g, ' '),
    body: match[2] ?? ''
  }));
}

describe('icon glyph size has one source of truth', () => {
  it('sizes .icon from --icon-size, which is defined', () => {
    const block = ruleBlockBody(appCss, '.icon');

    expect(block).toMatch(/width:\s*var\(--icon-size\)/);
    expect(block).toMatch(/height:\s*var\(--icon-size\)/);
    expect(appCss).toMatch(/--icon-size:\s*\S+;/);
    expect(appCss).toMatch(/--icon-size-sm:\s*\S+;/);
  });

  it('sizes an svg nowhere else in the stylesheet', () => {
    // A rule that mentions svg or .icon and sets a dimension is the shape that
    // drifted. Reading it from the token is fine — spelling a number is not.
    const offenders = ruleBlocks(appCss)
      .filter(({ selector }) => /\bsvg\b|\.icon\b/.test(selector))
      .flatMap(({ selector, body }) =>
        [...body.matchAll(/\b(?:min-|max-)?(?:width|height):\s*([^;]+)/g)]
          .filter((declaration) => !/var\(--icon-size/.test(declaration[1] ?? ''))
          .map((declaration) => `${selector} { ${declaration[0]?.trim()} }`)
      );

    expect(offenders).toEqual([]);
  });

  it('leaves every icon component to the class rather than sizing itself', () => {
    expect(iconComponents.length).toBeGreaterThan(5);

    for (const [name, source] of [...iconComponents, ['ThemeToggle.svelte', themeToggle] as const]) {
      // One `class="icon ..."` per <svg>, and no second way to say how big it is.
      expect(source.match(/<svg\b/g), `no svg in ${name}`).not.toBeNull();
      expect(source.match(/class="icon\b/g)?.length, `${name} does not size every svg from .icon`).toBe(source.match(/<svg\b/g)?.length);
      expect(source, `${name} sizes an svg with a utility`).not.toMatch(/\b[hw]-\[/);
      expect(source, `${name} sizes an svg with an attribute`).not.toMatch(/<svg\b[^>]*\s(?:width|height)=/);
    }
  });

  it('keeps the card-icons tap target at or above the WCAG 2.2 SC 2.5.8 floor', () => {
    // 24px is a floor, not a style choice, and it has to hold whatever the glyph
    // becomes — so it is derived rather than stated next to a prose copy of the
    // glyph size that nothing keeps in step.
    const block = ruleBlockBody(appCss, '.card-icons button');

    expect(block).toMatch(/min-width:\s*max\(24px,\s*var\(--icon-size\)\)/);
    expect(block).toMatch(/min-height:\s*max\(24px,\s*var\(--icon-size\)\)/);
  });
});
