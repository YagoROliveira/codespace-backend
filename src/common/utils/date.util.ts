/**
 * Date utilities — Brazil timezone (UTC-3, no DST since 2019)
 *
 * The application stores cronogram dates using local-time Date operations.
 * When generated on a BRT machine, midnight BRT → 03:00 UTC (next calendar day in ISO).
 * These helpers normalize date comparisons to the Brazil timezone so dates match
 * regardless of the server's system timezone (local Mac vs Vercel UTC).
 */

/** IANA timezone used throughout the app */
export const APP_TZ = 'America/Sao_Paulo';

/**
 * Returns 'YYYY-MM-DD' in Brazil timezone.
 * Consistent whether the server runs in UTC or BRT.
 */
export function toBRDateStr(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // 'en-CA' locale outputs dates in YYYY-MM-DD format
  return d.toLocaleDateString('en-CA', { timeZone: APP_TZ });
}

/**
 * Returns the day-of-week (0=Sun … 6=Sat) for the given date in Brazil timezone.
 */
export function getDayOfWeekBR(date: Date): number {
  const brStr = toBRDateStr(date);
  // Parse the BRT date string at noon UTC so there's no timezone ambiguity
  return new Date(brStr + 'T12:00:00Z').getUTCDay();
}

/**
 * Advances a Date by exactly one calendar day (24 h).
 * Safe in Brazil because there is no DST since 2019.
 */
export function advanceOneDay(date: Date): void {
  date.setTime(date.getTime() + 86_400_000);
}
