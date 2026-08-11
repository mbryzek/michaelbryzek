import { error } from '@sveltejs/kit';
import type { D1Database } from '@cloudflare/workers-types';
import type { Day, Idea, Item, ItemKind, Note, Question, Trip } from '$lib/trip/types';
import { TRIP_SLUG } from '$lib/trip/types';

/**
 * Every query in the app. Kept in one file because the whole schema is five
 * tables and a few hundred rows — a repository layer per table would be more
 * structure than there is subject matter.
 */

export function db(platform: App.Platform | undefined): D1Database {
  const binding = platform?.env?.TRIP_DB;
  if (!binding) error(503, 'Trip database is not bound');
  return binding;
}

/* ------------------------------------------------------------------ *
 * Row mapping. D1 returns SQLite's 0/1 for booleans and snake_case
 * columns; the API speaks camelCase and real booleans.
 * ------------------------------------------------------------------ */

interface ItemRow {
  id: number;
  date: string;
  kind: string;
  title: string;
  detail: string | null;
  start_time: string | null;
  end_time: string | null;
  cost: string | null;
  cost_note: string | null;
  confirmed: number;
}

function toItem(row: ItemRow): Item {
  return {
    id: row.id,
    date: row.date,
    kind: row.kind as ItemKind,
    title: row.title,
    detail: row.detail,
    startTime: row.start_time,
    endTime: row.end_time,
    cost: row.cost,
    costNote: row.cost_note,
    confirmed: row.confirmed === 1
  };
}

interface IdeaRow {
  id: number;
  date: string;
  title: string;
  detail: string | null;
  source_q: string | null;
  saved_by: string;
  promoted_at: string | null;
  created_at: string;
}

function toIdea(row: IdeaRow): Idea {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    detail: row.detail,
    sourceQ: row.source_q,
    savedBy: row.saved_by,
    promotedAt: row.promoted_at,
    createdAt: row.created_at
  };
}

interface NoteRow {
  id: number;
  date: string;
  author: string;
  body: string;
  created_at: string;
}

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    date: row.date,
    author: row.author,
    body: row.body,
    createdAt: row.created_at
  };
}

interface QuestionRow {
  id: number;
  question: string;
  date: string | null;
  resolved_at: string | null;
}

function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    question: row.question,
    date: row.date,
    resolvedAt: row.resolved_at
  };
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

/**
 * The whole trip in one round trip. It is a few hundred rows, and fetching it
 * whole is what lets the app mirror everything locally and open with no signal
 * — which it needs to do in Varenna, in Praiano, and on the Paros ferry.
 */
export async function loadTrip(d1: D1Database): Promise<Trip> {
  const [days, items, ideas, notes, questions] = await d1.batch([
    d1.prepare('SELECT date, place, country, summary, lodging FROM days WHERE trip_slug = ? ORDER BY date').bind(TRIP_SLUG),
    d1
      .prepare(
        `SELECT id, date, kind, title, detail, start_time, end_time, cost, cost_note, confirmed
         FROM items WHERE trip_slug = ? ORDER BY date, sort_order, id`
      )
      .bind(TRIP_SLUG),
    d1
      .prepare(
        `SELECT id, date, title, detail, source_q, saved_by, promoted_at, created_at
         FROM ideas WHERE trip_slug = ? ORDER BY date, created_at`
      )
      .bind(TRIP_SLUG),
    d1
      .prepare(
        `SELECT id, date, author, body, created_at
         FROM notes WHERE trip_slug = ? ORDER BY date, created_at`
      )
      .bind(TRIP_SLUG),
    d1
      .prepare(
        `SELECT id, question, date, resolved_at
         FROM questions WHERE trip_slug = ? ORDER BY sort_order, id`
      )
      .bind(TRIP_SLUG)
  ]);

  return {
    days: days.results as unknown as Day[],
    items: (items.results as unknown as ItemRow[]).map(toItem),
    ideas: (ideas.results as unknown as IdeaRow[]).map(toIdea),
    notes: (notes.results as unknown as NoteRow[]).map(toNote),
    questions: (questions.results as unknown as QuestionRow[]).map(toQuestion)
  };
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

export async function addNote(d1: D1Database, date: string, author: string, body: string): Promise<Note> {
  const row = await d1
    .prepare(
      `INSERT INTO notes (trip_slug, date, author, body) VALUES (?, ?, ?, ?)
       RETURNING id, date, author, body, created_at`
    )
    .bind(TRIP_SLUG, date, author, body)
    .first<NoteRow>();
  if (!row) error(500, 'Could not save note');
  return toNote(row);
}

export async function deleteNote(d1: D1Database, id: number): Promise<void> {
  await d1.prepare('DELETE FROM notes WHERE trip_slug = ? AND id = ?').bind(TRIP_SLUG, id).run();
}

export async function addIdea(
  d1: D1Database,
  input: { date: string; title: string; detail: string | null; sourceQ: string | null; savedBy: string }
): Promise<Idea> {
  const row = await d1
    .prepare(
      `INSERT INTO ideas (trip_slug, date, title, detail, source_q, saved_by) VALUES (?, ?, ?, ?, ?, ?)
       RETURNING id, date, title, detail, source_q, saved_by, promoted_at, created_at`
    )
    .bind(TRIP_SLUG, input.date, input.title, input.detail, input.sourceQ, input.savedBy)
    .first<IdeaRow>();
  if (!row) error(500, 'Could not save idea');
  return toIdea(row);
}

export async function deleteIdea(d1: D1Database, id: number): Promise<void> {
  await d1.prepare('DELETE FROM ideas WHERE trip_slug = ? AND id = ?').bind(TRIP_SLUG, id).run();
}

/**
 * Graduates a saved idea into the day's plan. The idea row is kept and stamped
 * rather than deleted, so the provenance — the question that produced it —
 * survives the promotion.
 */
export async function promoteIdea(d1: D1Database, id: number): Promise<Item> {
  const idea = await d1
    .prepare(
      `SELECT id, date, title, detail, source_q, saved_by, promoted_at, created_at
       FROM ideas WHERE trip_slug = ? AND id = ? AND promoted_at IS NULL`
    )
    .bind(TRIP_SLUG, id)
    .first<IdeaRow>();
  if (!idea) error(404, 'No unpromoted idea with that id');

  const item = await d1
    .prepare(
      `INSERT INTO items (trip_slug, date, kind, title, detail, confirmed, sort_order)
       VALUES (?, ?, 'activity', ?, ?, 0, 50)
       RETURNING id, date, kind, title, detail, start_time, end_time, cost, cost_note, confirmed`
    )
    .bind(TRIP_SLUG, idea.date, idea.title, idea.detail)
    .first<ItemRow>();
  if (!item) error(500, 'Could not add to the day');

  await d1.prepare(`UPDATE ideas SET promoted_at = datetime('now') WHERE trip_slug = ? AND id = ?`).bind(TRIP_SLUG, id).run();

  return toItem(item);
}

export async function addItem(
  d1: D1Database,
  input: {
    date: string;
    kind: ItemKind;
    title: string;
    detail: string | null;
    startTime: string | null;
    confirmed: boolean;
  }
): Promise<Item> {
  const row = await d1
    .prepare(
      `INSERT INTO items (trip_slug, date, kind, title, detail, start_time, confirmed, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, 50)
       RETURNING id, date, kind, title, detail, start_time, end_time, cost, cost_note, confirmed`
    )
    .bind(TRIP_SLUG, input.date, input.kind, input.title, input.detail, input.startTime, input.confirmed ? 1 : 0)
    .first<ItemRow>();
  if (!row) error(500, 'Could not add to the day');
  return toItem(row);
}

/**
 * Partial update. Only the fields present in `patch` are written, so the notes
 * screen filling in a train time cannot blank out a cost it never loaded.
 */
export async function updateItem(
  d1: D1Database,
  id: number,
  patch: Partial<Pick<Item, 'title' | 'detail' | 'startTime' | 'endTime' | 'cost' | 'confirmed'>>
): Promise<Item> {
  const columns: Record<string, string> = {
    title: 'title',
    detail: 'detail',
    startTime: 'start_time',
    endTime: 'end_time',
    cost: 'cost',
    confirmed: 'confirmed'
  };

  const sets: string[] = [];
  const values: (string | number | null)[] = [];
  for (const [field, column] of Object.entries(columns)) {
    if (!(field in patch)) continue;
    const value = patch[field as keyof typeof patch];
    sets.push(`${column} = ?`);
    values.push(typeof value === 'boolean' ? (value ? 1 : 0) : (value ?? null));
  }
  if (sets.length === 0) error(400, 'Nothing to update');

  const row = await d1
    .prepare(
      `UPDATE items SET ${sets.join(', ')} WHERE trip_slug = ? AND id = ?
       RETURNING id, date, kind, title, detail, start_time, end_time, cost, cost_note, confirmed`
    )
    .bind(...values, TRIP_SLUG, id)
    .first<ItemRow>();
  if (!row) error(404, 'No item with that id');
  return toItem(row);
}

export async function deleteItem(d1: D1Database, id: number): Promise<void> {
  await d1.prepare('DELETE FROM items WHERE trip_slug = ? AND id = ?').bind(TRIP_SLUG, id).run();
}

export async function updateDaySummary(d1: D1Database, date: string, summary: string): Promise<void> {
  await d1.prepare('UPDATE days SET summary = ? WHERE trip_slug = ? AND date = ?').bind(summary, TRIP_SLUG, date).run();
}

export async function resolveQuestion(d1: D1Database, id: number, resolved: boolean): Promise<void> {
  await d1
    .prepare(
      `UPDATE questions SET resolved_at = ${resolved ? "datetime('now')" : 'NULL'}
       WHERE trip_slug = ? AND id = ?`
    )
    .bind(TRIP_SLUG, id)
    .run();
}

export async function addQuestion(d1: D1Database, question: string, date: string | null): Promise<Question> {
  const row = await d1
    .prepare(
      `INSERT INTO questions (trip_slug, question, date, sort_order)
       VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM questions WHERE trip_slug = ?))
       RETURNING id, question, date, resolved_at`
    )
    .bind(TRIP_SLUG, question, date, TRIP_SLUG)
    .first<QuestionRow>();
  if (!row) error(500, 'Could not add question');
  return toQuestion(row);
}
