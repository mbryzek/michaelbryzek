import { describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { COOKIE_NAME, issueSession, passwordMatches, readSession, sha256Hex } from './auth';

const SECRET = 'test-cookie-secret-not-the-real-one';

/** The two methods of `Cookies` this module actually uses. */
function fakeCookies(): Cookies & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    get: (name: string) => store.get(name),
    set: (name: string, value: string) => store.set(name, value),
    delete: (name: string) => void store.delete(name)
  } as unknown as Cookies & { store: Map<string, string> };
}

describe('passwordMatches', () => {
  it('accepts the right password and rejects the wrong one', async () => {
    const hash = await sha256Hex('lake como');
    expect(await passwordMatches('lake como', hash)).toBe(true);
    expect(await passwordMatches('lake comi', hash)).toBe(false);
    expect(await passwordMatches('', hash)).toBe(false);
  });

  it('tolerates a hash pasted with whitespace or capitals', async () => {
    const hash = await sha256Hex('praiano');
    expect(await passwordMatches('praiano', `  ${hash.toUpperCase()}\n`)).toBe(true);
  });

  /**
   * An unset secret must fail closed. Cloudflare hands an unconfigured binding
   * over as undefined rather than throwing, so without this the app would open
   * for anyone the moment a secret was missing from a deploy.
   */
  it('rejects everything when no hash is configured', async () => {
    expect(await passwordMatches('anything', '')).toBe(false);
  });
});

describe('session cookies', () => {
  it('round-trips a name', async () => {
    const cookies = fakeCookies();
    await issueSession(cookies, 'Lisa', SECRET);

    const session = await readSession(cookies, SECRET);
    expect(session?.name).toBe('Lisa');
  });

  /** The name is the note byline, so a forged one attributes a note to someone else. */
  it('rejects a cookie whose payload was edited', async () => {
    const cookies = fakeCookies();
    await issueSession(cookies, 'Lisa', SECRET);

    const [, signature] = cookies.store.get(COOKIE_NAME)!.split('.');
    const forged = btoa(JSON.stringify({ name: 'Mike', exp: 4_000_000_000 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    cookies.store.set(COOKIE_NAME, `${forged}.${signature}`);

    expect(await readSession(cookies, SECRET)).toBeNull();
  });

  it('rejects a cookie signed with a different secret', async () => {
    const cookies = fakeCookies();
    await issueSession(cookies, 'Lisa', SECRET);
    expect(await readSession(cookies, 'some-other-secret')).toBeNull();
  });

  it('rejects a malformed cookie', async () => {
    const cookies = fakeCookies();
    cookies.store.set(COOKIE_NAME, 'not-a-real-cookie');
    expect(await readSession(cookies, SECRET)).toBeNull();
  });

  it('rejects an expired cookie', async () => {
    const cookies = fakeCookies();
    // Signed with the real secret, so only the expiry check can reject it.
    const payload = btoa(JSON.stringify({ name: 'Mike', exp: 1_000 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = [...new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)))]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    cookies.store.set(COOKIE_NAME, `${payload}.${signature}`);
    expect(await readSession(cookies, SECRET)).toBeNull();
  });

  it('returns null when no cookie is present', async () => {
    expect(await readSession(fakeCookies(), SECRET)).toBeNull();
  });
});
