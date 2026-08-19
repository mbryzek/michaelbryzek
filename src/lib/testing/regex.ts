/**
 * Test-only support for the suites that assert on a file's own text — the
 * stylesheet's z-index ordering and theme tokens, a component's scoped styles,
 * and the sitemap's `<loc>` list. Each of those pulls capture groups out of a
 * match, and under `noUncheckedIndexedAccess` a capture group is
 * `string | undefined`, so every call site would otherwise carry its own
 * non-null assertion. These do the narrowing once and hand back definite
 * strings.
 */

/** Every capture group 1 of `pattern` found in `haystack`, in order. */
export function captures(haystack: string, pattern: RegExp): string[] {
  return [...haystack.matchAll(pattern)].flatMap((match) => (match[1] === undefined ? [] : [match[1]]));
}

/** `selector` as a pattern that matches itself, every metacharacter escaped. */
function literal(selector: string): string {
  return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The body of the first `<selector> { ... }` block in `css`.
 *
 * `selector` is matched literally. Worth stating, because the obvious spelling —
 * one `\` in front of an interpolated selector — escapes the leading character
 * and leaves the rest live: right for a class by luck, harmless for
 * `[data-theme='light']` by luck, and wrong for the first selector carrying a
 * `(`, a `+` or a `*`, where it would match some other block and assert on it
 * happily.
 *
 * FIRST block, and `[^}]*` for the body, so a selector written twice resolves to
 * whichever copy comes first and a nested block ends the match early.
 * `.mobile-menu` in `Shell.svelte` is already both — a base rule and a
 * `@media (max-width: 640px)` override — so a caller after a declaration only
 * the override carries reads nothing rather than reading the override. Assert on
 * what came back, the way `zIndexOf` in `Shell.test.ts` does; do not assume the
 * block you meant is the block you got.
 *
 * Throws rather than returning `undefined`: every caller wants a definite
 * string, and a stylesheet with no such block is a broken test either way — the
 * message names the selector so it reads the same as the assertion it replaced.
 */
export function ruleBlockBody(css: string, selector: string): string {
  const body = captures(css, new RegExp(`${literal(selector)}\\s*\\{([^}]*)\\}`, 'g'))[0];
  if (body === undefined) {
    throw new Error(`no rule block for ${selector}`);
  }
  return body;
}

/**
 * The contents of a `.svelte` file's `<style>` block.
 *
 * Svelte scopes those rules at compile time and vitest applies none of them, so
 * a suite that cares which attribute state a rule keys off has to read the
 * source rather than the DOM.
 */
export function styleBlock(svelteSource: string): string {
  const body = captures(svelteSource, /<style[^>]*>([\s\S]*)<\/style>/g)[0];
  if (body === undefined) {
    throw new Error('no <style> block in this source');
  }
  return body;
}
