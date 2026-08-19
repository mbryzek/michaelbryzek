/**
 * Test-only support for the suites that sweep the repo's own `.svelte` sources
 * to enforce a rule no compiler can — `ui/Link.svelte` owns `target`/`rel`,
 * `Seo.svelte` owns the document title. Those rules are invisible to the build,
 * to svelte-check, to eslint and to every other test, so the sweep is the only
 * thing standing between them and a hand-written copy, and a walk that quietly
 * returned fewer files would turn both suites green with the guard gone.
 *
 * One walker, so there is one thing to get right rather than one per suite.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every `.svelte` file under `root`, recursively, as repo-relative paths in
 * sorted order.
 *
 * `root` is repo-relative too (`'src'`, `join('src', 'routes')`) — vitest runs
 * from the repo root. Paths go in and come out in the same shape, so a caller
 * cannot hand `readFileSync` an absolute path it then reports as a repo-relative
 * one, and a failure names the file the way you would open it.
 */
export function svelteSources(root: string): string[] {
  return walk(root).sort();
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.isFile() && entry.name.endsWith('.svelte') ? [path] : [];
  });
}
