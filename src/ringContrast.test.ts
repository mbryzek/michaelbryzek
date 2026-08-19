/**
 * The focus ring has to be a boundary a keyboard visitor can see, and that is a
 * property of a colour composited over the surface behind it — not of the token
 * read on its own. `--ring` used to be the accent at 0.22 alpha in light and
 * 0.30 in dark, which resolves to 1.34:1 and 1.75:1 against the three surfaces
 * this site puts focusable elements on: visible, but a wash rather than an edge,
 * and under the 3:1 that WCAG 2.2 SC 2.4.13 (Focus Appearance) and SC 1.4.11
 * (Non-text Contrast) both ask of a focus indicator.
 *
 * Nothing in the repo could catch that. svelte-check, eslint and prettier are
 * blind to colour, and a screenshot taken with a mouse never shows the ring at
 * all — the ISS-4572 change that put the site ring on every focusable element
 * also removed the browser outline that had been quietly covering for it on
 * eight of them. So the arithmetic is the test: resolve the token per palette,
 * composite each of its bands over each surface, and fail under 3:1.
 *
 * Written against the token's STRUCTURE rather than against the two literals it
 * happens to hold, so retuning --accent or a surface is caught, and so is a
 * future ring with a different number of layers.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { captures, ruleBlockBody } from '$lib/testing/regex';

const appCss = readFileSync(fileURLToPath(new URL('./app.css', import.meta.url)), 'utf8');

/** SC 2.4.13 asks for a band at least as thick as a 2 CSS pixel perimeter. */
const MIN_BAND_PX = 2;
/** SC 2.4.13 and SC 1.4.11 both ask for 3:1. */
const MIN_CONTRAST = 3;

/** The surfaces this site paints a focusable element on. The ring sits outside
 *  the element's border box, so these — not the element's own fill — are what
 *  it is composited over. */
const SURFACE_TOKENS = ['--bg', '--surface', '--surface-2'] as const;

type Rgb = { r: number; g: number; b: number };
type Rgba = Rgb & { a: number };
/** One painted band of the ring: `px` thick, in colour `color`. */
type Band = { px: number; color: Rgba };

/** Every `--name: value;` declaration in the first `<selector> { ... }` block. */
function tokensIn(selector: string): Record<string, string> {
  const body = ruleBlockBody(appCss, selector);
  const declarations = captures(body, /(--[\w-]+\s*:[^;]*);/g);
  return Object.fromEntries(
    declarations.flatMap((declaration) => {
      const [name, ...rest] = declaration.split(':');
      return name === undefined ? [] : [[name.trim(), rest.join(':').trim()]];
    })
  );
}

function parseColor(text: string): Rgba {
  const hex = /^#([0-9a-f]{6})$/i.exec(text.trim());
  if (hex?.[1] !== undefined) {
    const value = Number.parseInt(hex[1], 16);
    return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff, a: 1 };
  }
  const rgb = /^rgba?\(([^)]*)\)$/i.exec(text.trim());
  if (rgb?.[1] !== undefined) {
    const parts = rgb[1].split(/[\s,/]+/).filter((part) => part !== '');
    const [r, g, b, a] = parts.map(Number);
    if (r !== undefined && g !== undefined && b !== undefined) {
      return { r, g, b, a: a === undefined ? 1 : a };
    }
  }
  throw new Error(`cannot read colour ${text}`);
}

/** WCAG relative luminance of an opaque colour. */
function luminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** What the eye actually receives: `color` painted over `behind`. */
function composite(color: Rgba, behind: Rgb): Rgb {
  return {
    r: color.r * color.a + behind.r * (1 - color.a),
    g: color.g * color.a + behind.g * (1 - color.a),
    b: color.b * color.a + behind.b * (1 - color.a)
  };
}

function contrast(color: Rgba, behind: Rgb): number {
  const front = luminance(composite(color, behind));
  const back = luminance(behind);
  return (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05);
}

/** Split a comma-separated value without cutting inside `rgb(...)`. */
function topLevelParts(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const character of value) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += character;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter((part) => part !== '');
}

/**
 * The ring as it is painted, outermost band last.
 *
 * box-shadow paints the FIRST layer on top of the others, so a layer's visible
 * band starts where the widest spread declared before it ended — the 2px --bg
 * layer covers the inner 2px of the 5px --accent layer, leaving a 3px accent
 * band. Reading thickness rather than spread is what makes the 3:1 assertion
 * below mean "3:1 over an area SC 2.4.13 counts".
 */
function bandsOf(ring: string, palette: Record<string, string>): Band[] {
  const resolved = ring.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    const value = palette[name];
    if (value === undefined) throw new Error(`--ring reads ${name}, which no palette declares`);
    return value;
  });

  let covered = 0;
  return topLevelParts(resolved).map((layer) => {
    const spread = /(-?[\d.]+)px\s+(#[0-9a-f]{3,8}|rgba?\([^)]*\))\s*$/i.exec(layer);
    if (spread?.[1] === undefined || spread[2] === undefined) {
      throw new Error(`cannot read a spread and a colour out of ring layer "${layer}"`);
    }
    const outer = Number(spread[1]);
    const band = { px: outer - covered, color: parseColor(spread[2]) };
    covered = Math.max(covered, outer);
    return band;
  });
}

const SHARED = tokensIn(':root');

describe('focus ring contrast', () => {
  it('declares the ring once, palette-independently', () => {
    // Both layers name palette tokens, so there is nothing left for a per-theme
    // copy to say — and a second copy is how the two palettes drift apart.
    expect(captures(appCss, /^\s*(--ring)\s*:/gm)).toEqual(['--ring']);
    expect(SHARED['--ring'], '--ring is not in the shared :root block').toBeDefined();
  });

  for (const theme of ['dark', 'light'] as const) {
    const palette = { ...SHARED, ...tokensIn(`[data-theme='${theme}']`) };

    for (const surface of SURFACE_TOKENS) {
      it(`shows a ${MIN_BAND_PX}px band at ${MIN_CONTRAST}:1 over ${surface} in ${theme}`, () => {
        const behindToken = palette[surface];
        expect(behindToken, `${theme} declares no ${surface}`).toBeDefined();
        const behind = parseColor(behindToken!);

        const ring = palette['--ring'];
        expect(ring, 'no --ring token').toBeDefined();

        const ratios = bandsOf(ring!, palette)
          .filter((band) => band.px >= MIN_BAND_PX)
          .map((band) => contrast(band.color, behind));
        const best = Math.max(0, ...ratios);

        expect(
          best,
          `the widest ${MIN_BAND_PX}px-or-thicker band of --ring reaches only ${best.toFixed(2)}:1 over ${surface} in ${theme}`
        ).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
    }
  }
});
