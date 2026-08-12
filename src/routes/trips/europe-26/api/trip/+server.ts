import { error, json, type RequestHandler } from '@sveltejs/kit';
import { requireSession } from '$lib/server/trip/auth';
import { addItem, addQuestion, db, deleteItem, loadTrip, resolveQuestion, updateDaySummary, updateItem } from '$lib/server/trip/db';
import { isValidTripDate } from '$lib/trip/dates';
import type { ItemKind } from '$lib/trip/types';

export const prerender = false;

const KINDS: ItemKind[] = ['flight', 'train', 'lodging', 'dining', 'activity', 'transfer'];

/** The whole trip, in one request, so the client can mirror it for offline use. */
export const GET: RequestHandler = async ({ cookies, platform }) => {
  await requireSession(cookies, platform);
  return json(await loadTrip(db(platform)));
};

/** Adds an item, or a new open question. */
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  await requireSession(cookies, platform);
  const d1 = db(platform);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) error(400, 'Expected a JSON body');

  if (body.what === 'question') {
    const question = String(body.question ?? '').trim();
    if (!question) error(400, 'A question needs text');
    const date = body.date == null ? null : String(body.date);
    if (date !== null && !isValidTripDate(date)) error(400, 'That date is outside the trip');
    return json(await addQuestion(d1, question, date));
  }

  const date = String(body.date ?? '');
  if (!isValidTripDate(date)) error(400, 'That date is outside the trip');

  const kind = String(body.kind ?? 'activity') as ItemKind;
  if (!KINDS.includes(kind)) error(400, 'Unknown kind of item');

  const title = String(body.title ?? '').trim();
  if (!title) error(400, 'An item needs a title');

  return json(
    await addItem(d1, {
      date,
      kind,
      title,
      detail: body.detail == null ? null : String(body.detail),
      startTime: body.startTime == null ? null : String(body.startTime),
      confirmed: body.confirmed === true
    })
  );
};

/** Edits an item, a day summary, or the resolved state of a question. */
export const PATCH: RequestHandler = async ({ request, cookies, platform }) => {
  await requireSession(cookies, platform);
  const d1 = db(platform);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) error(400, 'Expected a JSON body');

  if (body.what === 'day') {
    const date = String(body.date ?? '');
    if (!isValidTripDate(date)) error(400, 'That date is outside the trip');
    await updateDaySummary(d1, date, String(body.summary ?? ''));
    return json({ ok: true });
  }

  if (body.what === 'question') {
    const id = Number(body.id);
    if (!Number.isInteger(id)) error(400, 'Which question?');
    await resolveQuestion(d1, id, body.resolved === true);
    return json({ ok: true });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id)) error(400, 'Which item?');

  // Only fields actually present are written, so an edit to one field cannot
  // blank out another the client never loaded.
  const patch: Parameters<typeof updateItem>[2] = {};
  if ('title' in body) patch.title = String(body.title ?? '').trim();
  if ('detail' in body) patch.detail = body.detail == null ? null : String(body.detail);
  if ('startTime' in body) patch.startTime = body.startTime == null ? null : String(body.startTime);
  if ('endTime' in body) patch.endTime = body.endTime == null ? null : String(body.endTime);
  if ('cost' in body) patch.cost = body.cost == null ? null : String(body.cost);
  if ('confirmed' in body) patch.confirmed = body.confirmed === true;

  return json(await updateItem(d1, id, patch));
};

export const DELETE: RequestHandler = async ({ url, cookies, platform }) => {
  await requireSession(cookies, platform);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) error(400, 'Which item?');
  await deleteItem(db(platform), id);
  return json({ ok: true });
};
