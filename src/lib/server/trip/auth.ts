import { error, type Cookies } from '@sveltejs/kit';

/**
 * One shared password for the two people on the trip, and a signed cookie so
 * neither of them types it again for ninety days. There are no accounts: real
 * auth for two people who share a hotel room is ceremony, and the thing being
 * protected is a list of dinner reservations.
 *
 * The password gates the *data*, not the page. The route's HTML is a static
 * shell containing no trip content, so a leaked URL reveals a login box.
 */

export const COOKIE_NAME = 'trip_session';
const MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

interface Session {
  /** Display name, so notes are attributed. */
  name: string;
  /** Expiry, epoch seconds. */
  exp: number;
}

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

/**
 * Compares in time independent of where the strings first differ. Overkill for
 * a trip app, but the alternative is explaining why it's fine.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordMatches(password: string, expectedHash: string): Promise<boolean> {
  if (!expectedHash) return false;
  return timingSafeEqual(await sha256Hex(password), expectedHash.trim().toLowerCase());
}

async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

/** base64url — the cookie value has to survive a Set-Cookie header intact. */
function b64urlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
}

export async function issueSession(cookies: Cookies, name: string, secret: string): Promise<void> {
  const session: Session = {
    name: name.slice(0, 40),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS
  };
  const payload = b64urlEncode(JSON.stringify(session));
  const value = `${payload}.${await hmac(payload, secret)}`;

  cookies.set(COOKIE_NAME, value, {
    path: '/trips',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS
  });
}

export function clearSession(cookies: Cookies): void {
  cookies.delete(COOKIE_NAME, { path: '/trips' });
}

export async function readSession(cookies: Cookies, secret: string): Promise<Session | null> {
  const raw = cookies.get(COOKIE_NAME);
  if (!raw || !secret) return null;

  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return null;
  if (!timingSafeEqual(signature, await hmac(payload, secret))) return null;

  try {
    const session = JSON.parse(b64urlDecode(payload)) as Session;
    if (typeof session.exp !== 'number' || session.exp * 1000 < Date.now()) return null;
    if (typeof session.name !== 'string' || !session.name) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Every trip endpoint's first line. Throws a 401 rather than returning null so
 * a forgotten check is a compile-time missing variable, not a silent data leak.
 */
export async function requireSession(cookies: Cookies, platform: App.Platform | undefined): Promise<Session> {
  const secret = platform?.env?.TRIP_COOKIE_SECRET;
  if (!secret) error(503, 'Trip app is not configured');

  const session = await readSession(cookies, secret);
  if (!session) error(401, 'Not signed in');
  return session;
}
