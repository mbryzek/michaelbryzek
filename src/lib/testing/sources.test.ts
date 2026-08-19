/**
 * The walker is the foundation of two sweeps that guard rules no compiler can
 * see, and its failure mode is silence: a walk that stops recursing, or that
 * hands back a path `readFileSync` cannot open, leaves both suites green with
 * nothing swept. Each suite carries a canary against that, and this pins the
 * shared half once so the canaries are not the only thing standing there.
 */
import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { svelteSources } from './sources';

describe('svelteSources', () => {
  const files = svelteSources('src');

  it('recurses past the root, rather than listing one level', () => {
    // Four directories deep, so a walk that stopped at `src` would miss it.
    expect(files).toContain(join('src', 'lib', 'components', 'ui', 'Link.svelte'));
  });

  it('returns repo-relative paths a caller can read as it got them', () => {
    for (const path of files) {
      expect(isAbsolute(path), `${path} is absolute`).toBe(false);
      expect(() => readFileSync(path, 'utf8')).not.toThrow();
    }
  });

  it('returns only .svelte files', () => {
    for (const path of files) {
      expect(path.endsWith('.svelte'), `${path} is not a .svelte file`).toBe(true);
    }
  });

  it('sweeps only under the root it was given', () => {
    const routes = svelteSources(join('src', 'routes'));

    expect(routes.length).toBeGreaterThan(0);
    expect(routes.length).toBeLessThan(files.length);
    for (const path of routes) {
      expect(files).toContain(path);
    }
  });

  it('is sorted, so a failing sweep names files in a stable order', () => {
    expect(files).toStrictEqual([...files].sort());
  });
});
