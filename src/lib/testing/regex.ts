/**
 * Test-only support for the suites that assert on a file's own text — the
 * stylesheet's z-index ordering and theme tokens, and the sitemap's `<loc>`
 * list. Each of those pulls capture groups out of a match, and under
 * `noUncheckedIndexedAccess` a capture group is `string | undefined`, so every
 * call site would otherwise carry its own non-null assertion. These two do the
 * narrowing once and hand back definite strings.
 */

/** Every capture group 1 of `pattern` found in `haystack`, in order. */
export function captures(haystack: string, pattern: RegExp): string[] {
  return [...haystack.matchAll(pattern)].flatMap((match) => (match[1] === undefined ? [] : [match[1]]));
}

/**
 * The body of the first `<selector> { ... }` block in `css`.
 *
 * Throws rather than returning `undefined`: both callers want a definite
 * string, and a stylesheet with no such block is a broken test either way — the
 * message names the selector so it reads the same as the assertion it replaced.
 */
export function ruleBlockBody(css: string, selector: string): string {
  const body = captures(css, new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`, 'g'))[0];
  if (body === undefined) {
    throw new Error(`no rule block for ${selector}`);
  }
  return body;
}
