/**
 * `static/_headers` is the host's cache policy (Cloudflare Pages reads it from
 * the build root). The content-addressed paths are the ones safe to cache for a
 * year: their filenames change whenever their bytes do. Everything else — the
 * prerendered HTML in particular — must stay revalidated, or a release would sit
 * behind a visitor's cache.
 */
import { describe, expect, it } from 'vitest';
import { readSource } from '#lib/testing/source.ts';

const IMMUTABLE = 'Cache-Control: public, max-age=31536000, immutable';

/** Each rule in the file as `[path pattern, header lines]`. */
function rules(text: string): [string, string[]][] {
  const out: [string, string[]][] = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) {
      const last = out[out.length - 1];
      if (last) last[1].push(line.trim());
    } else {
      out.push([line.trim(), []]);
    }
  }
  return out;
}

const headers = rules(readSource(import.meta.url, '../static/_headers'));

describe('static/_headers', () => {
  it.each(['/_app/immutable/*', '/fonts/*'])('caches %s as immutable for a year', (pattern) => {
    expect(headers.find(([path]) => path === pattern)?.[1]).toContain(IMMUTABLE);
  });

  it('marks nothing immutable outside the content-addressed paths', () => {
    const immutable = headers.filter(([, lines]) => lines.some((l) => l.includes('immutable'))).map(([path]) => path);
    expect(immutable.sort()).toEqual(['/_app/immutable/*', '/fonts/*']);
  });
});
