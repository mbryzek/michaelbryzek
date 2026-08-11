import { error, type RequestHandler } from '@sveltejs/kit';
import { requireSession } from '$lib/server/trip/auth';
import { db, loadTrip } from '$lib/server/trip/db';
import { streamReply, type ChatTurn } from '$lib/server/trip/claude';
import { isValidTripDate, today } from '$lib/trip/dates';

export const prerender = false;

/** Enough context to be useful, short enough to stay cheap. */
const MAX_HISTORY_TURNS = 20;

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  await requireSession(cookies, platform);

  const apiKey = platform?.env?.ANTHROPIC_API_KEY;
  if (!apiKey) error(503, 'The assistant is not configured');

  const body = (await request.json().catch(() => null)) as {
    date?: string;
    question?: string;
    history?: ChatTurn[];
  } | null;

  const date = String(body?.date ?? '');
  if (!isValidTripDate(date)) error(400, 'That date is outside the trip');

  const question = (body?.question ?? '').trim();
  if (!question) error(400, 'Ask something');
  if (question.length > 4000) error(400, 'That question is too long');

  const history = (Array.isArray(body?.history) ? body.history : [])
    .filter((turn) => turn?.role === 'user' || turn?.role === 'assistant')
    .filter((turn) => typeof turn.content === 'string' && turn.content.trim() !== '')
    .slice(-MAX_HISTORY_TURNS);

  const trip = await loadTrip(db(platform));

  const stream = await streamReply({
    apiKey,
    trip,
    focusDate: date,
    todayIso: today(),
    history,
    question
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // Without this an intermediary can hold the whole reply and hand it over
      // at once, which defeats the point of streaming on slow hotel wifi.
      'cache-control': 'no-store',
      'x-accel-buffering': 'no'
    }
  });
};
