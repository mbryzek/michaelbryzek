/**
 * Test-only support for the suites that assert on a source file's own text.
 *
 * Several defects in this repo are pure cascade or pure markup — invisible to
 * `svelte-check`, to eslint and to a DOM with no layout engine — so the tests
 * that pin them read the stylesheet and the components as strings. Resolving a
 * path relative to the test that asks for it is the one step every such suite
 * needs, and it is worth owning once: `new URL(relative, import.meta.url)` is
 * easy to write and easy to write subtly differently.
 *
 * Reading a file the caller NAMES is this module. Walking a tree it does not
 * name is `walk.ts`.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** The text of `relative`, resolved against the caller's own `import.meta.url`. */
export function readSource(from: string, relative: string): string {
  return readFileSync(fileURLToPath(new URL(relative, from)), 'utf8');
}

/**
 * Every file in `relative` whose name ends in `suffix`, as `[name, text]`.
 *
 * A directory rather than a list, so a file added later is covered without
 * anyone remembering to add it here — which is the whole value of a test that
 * asserts a rule holds across a folder.
 */
export function readSourceDir(from: string, relative: string, suffix: string): [string, string][] {
  const dir = new URL(relative.endsWith('/') ? relative : `${relative}/`, from);
  return readdirSync(fileURLToPath(dir))
    .filter((name) => name.endsWith(suffix))
    .sort()
    .map((name) => [name, readSource(dir.href, name)]);
}
