import { error, json, type RequestHandler } from '@sveltejs/kit';
import { requireSession } from '$lib/server/trip/auth';
import { addIdea, db, deleteIdea, promoteIdea } from '$lib/server/trip/db';
import { isValidTripDate } from '$lib/trip/dates';

export const prerender = false;

/** Saves an assistant suggestion into a day, as a draft rather than a plan. */
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  const session = await requireSession(cookies, platform);

  const body = (await request.json().catch(() => null)) as {
    date?: string;
    title?: string;
    detail?: string;
    sourceQ?: string;
  } | null;

  const date = String(body?.date ?? '');
  if (!isValidTripDate(date)) error(400, 'That date is outside the trip');

  const title = (body?.title ?? '').trim();
  if (!title) error(400, 'An idea needs a title');

  return json(
    await addIdea(db(platform), {
      date,
      title: title.slice(0, 200),
      detail: body?.detail?.trim() || null,
      // Kept so that in October "why did we save this" has an answer.
      sourceQ: body?.sourceQ?.trim().slice(0, 500) || null,
      savedBy: session.name
    })
  );
};

/** Graduates an idea into the day's plan. */
export const PATCH: RequestHandler = async ({ request, cookies, platform }) => {
  await requireSession(cookies, platform);
  const body = (await request.json().catch(() => null)) as { id?: number } | null;
  const id = Number(body?.id);
  if (!Number.isInteger(id)) error(400, 'Which idea?');
  return json(await promoteIdea(db(platform), id));
};

export const DELETE: RequestHandler = async ({ url, cookies, platform }) => {
  await requireSession(cookies, platform);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) error(400, 'Which idea?');
  await deleteIdea(db(platform), id);
  return json({ ok: true });
};
