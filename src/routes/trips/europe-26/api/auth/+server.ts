import { error, json, type RequestHandler } from '@sveltejs/kit';
import { clearSession, issueSession, passwordMatches, readSession } from '$lib/server/trip/auth';

// The root layout sets prerender = true for the site; API routes must opt out.
export const prerender = false;

/** Is this browser already signed in, and as whom? */
export const GET: RequestHandler = async ({ cookies, platform }) => {
  const secret = platform?.env?.TRIP_COOKIE_SECRET;
  if (!secret) error(503, 'Trip app is not configured');

  const session = await readSession(cookies, secret);
  return json({ signedIn: session !== null, name: session?.name ?? null });
};

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  const env = platform?.env;
  if (!env?.TRIP_COOKIE_SECRET || !env?.TRIP_PASSWORD_HASH) {
    error(503, 'Trip app is not configured');
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
    name?: string;
  } | null;

  const password = body?.password?.trim();
  const name = body?.name?.trim();
  if (!password || !name) error(400, 'Password and name are both required');

  if (!(await passwordMatches(password, env.TRIP_PASSWORD_HASH))) {
    error(401, 'That password is not right');
  }

  await issueSession(cookies, name, env.TRIP_COOKIE_SECRET);
  return json({ signedIn: true, name });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  clearSession(cookies);
  return json({ signedIn: false });
};
