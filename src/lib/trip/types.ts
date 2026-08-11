/** Shapes shared by the trip API and the trip UI. */

export const TRIP_SLUG = 'europe-26';

/** First and last day of the trip, ISO `YYYY-MM-DD`. */
export const TRIP_START = '2026-09-09';
export const TRIP_END = '2026-10-03';

export type ItemKind = 'flight' | 'train' | 'lodging' | 'dining' | 'activity' | 'transfer';

export interface Day {
  date: string;
  place: string;
  country: string;
  summary: string | null;
  lodging: string | null;
}

export interface Item {
  id: number;
  date: string;
  kind: ItemKind;
  title: string;
  detail: string | null;
  startTime: string | null;
  endTime: string | null;
  cost: string | null;
  costNote: string | null;
  confirmed: boolean;
}

export interface Idea {
  id: number;
  date: string;
  title: string;
  detail: string | null;
  /** The question that produced this suggestion. */
  sourceQ: string | null;
  savedBy: string;
  promotedAt: string | null;
  createdAt: string;
}

export interface Note {
  id: number;
  date: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Question {
  id: number;
  question: string;
  date: string | null;
  resolvedAt: string | null;
}

/** Everything the app needs to render offline, fetched in one request. */
export interface Trip {
  days: Day[];
  items: Item[];
  ideas: Idea[];
  notes: Note[];
  questions: Question[];
}

/** A suggestion the assistant offered, in a form the UI can save with one tap. */
export interface Suggestion {
  title: string;
  detail: string;
}
