/**
 * Dates arrive as ISO strings in UTC and are shown in the user's time zone
 * (constitution §8). `dayKey` takes the zone, so tests can pin it.
 */

/** The calendar day an instant falls on in `timeZone`, as "2026-09-28". */
export function dayKey(isoDate: string, timeZone: string): string {
  // The en-CA locale happens to format dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(isoDate));
}

/**
 * A day heading for the user, e.g. "Monday, September 28", from a `dayKey`.
 * "2026-09-28" parses as midnight UTC, so it is formatted in UTC too: the
 * calendar day was already decided in the user's zone and must not shift.
 */
export function formatDay(day: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(day));
}
