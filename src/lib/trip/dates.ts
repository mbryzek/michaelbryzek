import { TRIP_END, TRIP_START } from './types';

/**
 * Trip dates are calendar days, not instants. Every helper here works on the
 * `YYYY-MM-DD` string directly rather than going through `Date`, because
 * `new Date('2026-09-09')` parses as midnight UTC and then renders as the
 * previous day for anyone west of Greenwich — which is both of us, right up
 * until we land.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Parses `YYYY-MM-DD` into a UTC-noon Date — safe to do weekday maths on. */
function parse(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function isValidTripDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= TRIP_START && date <= TRIP_END;
}

/** `Wednesday, September 9` */
export function formatLong(date: string): string {
  const d = parse(date);
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** `Wed Sep 9` */
export function formatShort(date: string): string {
  const d = parse(date);
  return `${WEEKDAYS[d.getUTCDay()].slice(0, 3)} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`;
}

/** `Wed` — the weekday alone, for a two-line date column. */
export function formatWeekday(date: string): string {
  return WEEKDAYS[parse(date).getUTCDay()].slice(0, 3);
}

/** `Sep 9` */
export function formatCompact(date: string): string {
  const d = parse(date);
  return `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`;
}

/** Today as `YYYY-MM-DD` in the viewer's own timezone. */
export function today(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Whole days from today until departure. Negative once the trip has started,
 * so the caller can distinguish "not yet" from "day 6 of 25" without a second
 * comparison.
 */
export function daysUntilDeparture(now: Date = new Date()): number {
  return daysBetween(today(now), TRIP_START);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
}

/** 1-based day number within the trip, or null when today falls outside it. */
export function tripDayNumber(now: Date = new Date()): number | null {
  const t = today(now);
  if (t < TRIP_START || t > TRIP_END) return null;
  return daysBetween(TRIP_START, t) + 1;
}

/**
 * The day the app should open to: today while travelling, the first day before
 * the trip, the last day after it.
 */
export function focusDate(now: Date = new Date()): string {
  const t = today(now);
  if (t < TRIP_START) return TRIP_START;
  if (t > TRIP_END) return TRIP_END;
  return t;
}

/** `2 hours ago`, `yesterday`, `Sep 3` — for note timestamps. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  // SQLite's datetime('now') returns 'YYYY-MM-DD HH:MM:SS' with no zone
  // marker; it is UTC, so say so before parsing or every note reads as hours
  // in the future.
  const stamp = iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`;
  const then = new Date(stamp).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((now.getTime() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return formatCompact(iso.slice(0, 10));
}
