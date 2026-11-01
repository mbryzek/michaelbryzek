/**
 * These helpers are what the suites asserting on a source file's own text stand
 * on, and their failure mode is silence: a tree read that stops recursing leaves
 * a sweep green with nothing swept. Each is pinned against the file resolved
 * relative to this test, never against the directory vitest was started from.
 */
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readSource, readSourceDir, readSourceTree } from './source';

describe('readSource', () => {
  it('resolves against the caller, whatever directory vitest started in', () => {
    const cwd = process.cwd();
    process.chdir('/');
    try {
      expect(readSource(import.meta.url, './source.ts')).toContain('export function readSource(');
    } finally {
      process.chdir(cwd);
    }
  });
});

describe('readSourceDir', () => {
  it('reads one level, named by file, sorted', () => {
    const names = readSourceDir(import.meta.url, '.', '.test.ts').map(([name]) => name);

    expect(names).toContain('source.test.ts');
    expect(names).toEqual([...names].sort());
  });

  it('does not recurse', () => {
    const names = readSourceDir(import.meta.url, '../..', '.svelte').map(([name]) => name);

    expect(names).not.toContain(join('lib', 'components', 'ui', 'Link.svelte'));
  });
});

describe('readSourceTree', () => {
  const entries = readSourceTree(import.meta.url, '../..', ['.css', '.svelte']);
  const names = entries.map(([name]) => name);

  it('recurses past the directory it was given', () => {
    expect(names).toContain(join('lib', 'components', 'ui', 'Link.svelte'));
  });

  it('takes every suffix it is given, and nothing else', () => {
    expect(names).toContain('app.css');
    expect(names.every((name) => name.endsWith('.css') || name.endsWith('.svelte'))).toBe(true);
  });

  it('returns each path relative to that directory, with its text, sorted', () => {
    expect(names).toEqual([...names].sort());
    expect(Object.fromEntries(entries)['app.css']).toBe(readSource(import.meta.url, '../../app.css'));
  });
});
