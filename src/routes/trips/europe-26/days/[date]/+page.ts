import type { EntryGenerator } from './$types';
import { TRIP_END, TRIP_START } from '$lib/trip/types';

/**
 * Every date in the trip, so the prerenderer can emit a shell per day rather
 * than failing on an un-enumerable dynamic route. The shells are identical and
 * carry no trip data — the day's content is fetched client-side — so this is
 * 25 tiny files that make each day URL directly shareable and cacheable for
 * offline use.
 */
export const entries: EntryGenerator = () => {
  const dates: { date: string }[] = [];
  const cursor = new Date(`${TRIP_START}T12:00:00Z`);
  const end = new Date(`${TRIP_END}T12:00:00Z`);

  while (cursor <= end) {
    dates.push({ date: cursor.toISOString().slice(0, 10) });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
};
