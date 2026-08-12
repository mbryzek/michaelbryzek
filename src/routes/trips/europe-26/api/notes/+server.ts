import { error, json, type RequestHandler } from '@sveltejs/kit';
import { requireSession } from '$lib/server/trip/auth';
import { addNote, db, deleteNote } from '$lib/server/trip/db';
import { isValidTripDate } from '$lib/trip/dates';

export const prerender = false;

/**
 * Notes are attributed to whoever unlocked the app on this device — the name
 * comes from the signed cookie rather than the request body, so a note cannot
 * be posted as the other person.
 */
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  const session = await requireSession(cookies, platform);

  const body = (await request.json().catch(() => null)) as {
    date?: string;
    body?: string;
  } | null;

  const date = String(body?.date ?? '');
  if (!isValidTripDate(date)) error(400, 'That date is outside the trip');

  const text = (body?.body ?? '').trim();
  if (!text) error(400, 'A note needs some text');
  if (text.length > 4000) error(400, 'That note is too long');

  return json(await addNote(db(platform), date, session.name, text));
};

export const DELETE: RequestHandler = async ({ url, cookies, platform }) => {
  await requireSession(cookies, platform);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) error(400, 'Which note?');
  await deleteNote(db(platform), id);
  return json({ ok: true });
};
