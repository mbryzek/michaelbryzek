/**
 * These two helpers are how four suites read the cascade, and the failure mode
 * that matters is a PASSING test: a selector that quietly matches some OTHER
 * block asserts against the wrong declarations, and nothing downstream can tell.
 *
 * So the escaping is pinned here rather than reviewed. The spelling this
 * replaced put a single `\` in front of an interpolated selector, which escapes
 * the first character and leaves every later one live — right for a plain class,
 * right for `[data-theme='light']` by luck, and wrong the moment a selector
 * carries a metacharacter of its own. Both directions of wrong are below, and
 * both are measured against selectors this repo actually writes.
 */
import { describe, expect, it } from 'vitest';
import { ruleBlockBody, styleBlock } from './regex';

describe('ruleBlockBody', () => {
  it('returns the body of the named block', () => {
    expect(ruleBlockBody('.topbar {\n  z-index: 50;\n}', '.topbar')).toContain('z-index: 50;');
  });

  it('reads a compound selector as itself, not as a pattern matching a neighbour', () => {
    // The silent half. An unescaped `.` between the two classes is "any
    // character", so `.btn.active` also matches `.btn-active` — and the block
    // written first wins. `Shell.svelte` writes `.mobile-menu-button.active`.
    const css = '.btn-active {\n  color: blue;\n}\n.btn.active {\n  color: red;\n}';

    expect(ruleBlockBody(css, '.btn.active')).toContain('red');
  });

  it('reads a selector carrying brackets and parentheses', () => {
    // The loud half, and a real selector: `ThemeToggle.svelte` keys its icons off
    // this one. Escaping only the leading `h` leaves `(` opening a capture group,
    // which both breaks the match and renumbers the group the body comes from.
    const selector = "html:not([data-theme='light']) .icon-sun";

    expect(ruleBlockBody(`${selector} {\n  display: none;\n}`, selector)).toContain('display: none;');
  });

  it('still reads the attribute selector that worked by luck before', () => {
    expect(ruleBlockBody("[data-theme='light'] {\n  --bg: white;\n}", "[data-theme='light']")).toContain('--bg');
  });

  it('does not match a longer selector that merely starts the same way', () => {
    const css = '.mobile-menu-overlay {\n  z-index: 999;\n}\n.mobile-menu {\n  z-index: 1000;\n}';

    expect(ruleBlockBody(css, '.mobile-menu')).toContain('1000');
  });

  it('throws naming the selector when there is no such block', () => {
    // The message is what the `expect(block, 'no rule block for .page-shell')`
    // assertions it replaced used to say, so a removed rule still reads the same.
    expect(() => ruleBlockBody('.topbar {\n  z-index: 50;\n}', '.page-shell')).toThrow('no rule block for .page-shell');
  });
});

describe('styleBlock', () => {
  it('returns what a component scopes, without the tags', () => {
    expect(styleBlock('<button>x</button>\n\n<style>\n  .icon-sun {\n    display: none;\n  }\n</style>\n')).toBe(
      '\n  .icon-sun {\n    display: none;\n  }\n'
    );
  });

  it('reads a style tag that carries attributes', () => {
    expect(styleBlock('<style lang="postcss">\n  .x {\n    color: red;\n  }\n</style>')).toContain('color: red;');
  });

  it('throws when the component has no scoped styles', () => {
    expect(() => styleBlock('<button>x</button>\n')).toThrow('no <style> block');
  });
});
