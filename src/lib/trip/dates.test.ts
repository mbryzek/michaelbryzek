import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  daysBetween,
  daysUntilDeparture,
  focusDate,
  formatCompact,
  formatLong,
  isValidTripDate,
  relativeTime,
  today,
  tripDayNumber
} from './dates';
import { TRIP_END, TRIP_START } from './types';

/**
 * The trip runs across four timezones and both travelers read it from a fifth
 * (Eastern) for the month before departure. Every assertion here exists because
 * the naive implementation of that function is wrong somewhere in that spread.
 */

// Assigning process.env.TZ re-runs tzset in Node, so this really does move the
// interpreter's timezone rather than only the variable. `vi.stubEnv` is used in
// preference to touching process directly so the tests need no node typings.
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('formatting', () => {
  /**
   * `new Date('2026-09-09')` parses as midnight *UTC* and then renders in local
   * time — so anywhere west of Greenwich, the trip's first day displays as
   * September 8. That is both of us, right up until the plane lands. These
   * helpers work on the date string instead, so the label cannot drift.
   */
  it('does not shift the date west of Greenwich', () => {
    vi.stubEnv('TZ', 'America/New_York');
    // Sanity check that the stub really moved the interpreter's timezone —
    // otherwise this test would pass against the broken implementation too.
    expect(new Date('2026-09-09').getDate()).toBe(8);

    expect(formatLong('2026-09-09')).toBe('Wednesday, September 9');
    expect(formatCompact('2026-09-09')).toBe('Sep 9');

    vi.stubEnv('TZ', 'Pacific/Auckland');
    expect(formatLong('2026-09-09')).toBe('Wednesday, September 9');
  });

  it('names the right weekday across the trip', () => {
    expect(formatLong(TRIP_START)).toBe('Wednesday, September 9');
    expect(formatLong('2026-09-13')).toBe('Sunday, September 13');
    expect(formatLong(TRIP_END)).toBe('Saturday, October 3');
  });
});

describe('trip bounds', () => {
  it('accepts trip dates and rejects everything else', () => {
    expect(isValidTripDate(TRIP_START)).toBe(true);
    expect(isValidTripDate(TRIP_END)).toBe(true);
    expect(isValidTripDate('2026-09-20')).toBe(true);

    expect(isValidTripDate('2026-09-08')).toBe(false);
    expect(isValidTripDate('2026-10-04')).toBe(false);
    expect(isValidTripDate('nonsense')).toBe(false);
    // A parseable date in the wrong shape must not slip through — the API
    // binds this straight into a SQL parameter.
    expect(isValidTripDate('2026-9-9')).toBe(false);
  });
});

describe('countdown', () => {
  it('counts down to departure before the trip', () => {
    expect(daysUntilDeparture(new Date('2026-08-11T12:00:00'))).toBe(29);
    expect(daysUntilDeparture(new Date('2026-09-08T12:00:00'))).toBe(1);
  });

  /**
   * The month before departure is spent in Eastern time. A countdown computed
   * from UTC ticks over five hours early, so on the evening of the 10th it
   * would already claim the 11th.
   */
  it('counts from the viewer’s own day, not UTC', () => {
    vi.stubEnv('TZ', 'America/New_York');
    // 21:00 Eastern on Aug 11 is already Aug 12 in UTC.
    expect(daysUntilDeparture(new Date('2026-08-11T21:00:00-04:00'))).toBe(29);
  });

  it('reports the day number once the trip starts', () => {
    expect(tripDayNumber(new Date('2026-08-11T12:00:00'))).toBeNull();
    expect(tripDayNumber(new Date('2026-09-09T12:00:00'))).toBe(1);
    expect(tripDayNumber(new Date('2026-09-21T12:00:00'))).toBe(13);
    expect(tripDayNumber(new Date('2026-10-03T12:00:00'))).toBe(25);
    expect(tripDayNumber(new Date('2026-10-04T12:00:00'))).toBeNull();
  });

  it('spans the trip in 25 days', () => {
    expect(daysBetween(TRIP_START, TRIP_END) + 1).toBe(25);
  });
});

describe('focusDate', () => {
  it('opens on the first day before the trip and today during it', () => {
    expect(focusDate(new Date('2026-08-11T12:00:00'))).toBe(TRIP_START);
    expect(focusDate(new Date('2026-09-19T12:00:00'))).toBe('2026-09-19');
    expect(focusDate(new Date('2026-11-01T12:00:00'))).toBe(TRIP_END);
  });
});

describe('relativeTime', () => {
  /**
   * SQLite's `datetime('now')` returns `YYYY-MM-DD HH:MM:SS` with no zone
   * marker. `new Date()` reads that as *local* time, so a note written in
   * Greece and read in New York timestamps six hours in the future and renders
   * as "just now" forever. The parser has to say UTC explicitly.
   */
  it('reads SQLite timestamps as UTC', () => {
    const now = new Date('2026-09-19T12:00:00Z');
    expect(relativeTime('2026-09-19 10:00:00', now)).toBe('2h ago');
    expect(relativeTime('2026-09-19 11:58:00', now)).toBe('2m ago');
    expect(relativeTime('2026-09-18 12:00:00', now)).toBe('yesterday');
  });

  it('also accepts ISO timestamps from optimistic local updates', () => {
    const now = new Date('2026-09-19T12:00:00Z');
    expect(relativeTime('2026-09-19T11:00:00.000Z', now)).toBe('1h ago');
  });

  it('returns empty rather than NaN for unparseable input', () => {
    expect(relativeTime('not a date')).toBe('');
  });
});

describe('today', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(today(new Date('2026-09-09T12:00:00'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today(new Date('2026-01-05T12:00:00'))).toBe('2026-01-05');
  });
});
