/**
 * Builds the default entry tag for the current day, e.g. `[dd-2026-10-04]`.
 * Uses local date parts (not `toISOString()`) so the tag matches the user's
 * calendar day instead of UTC, which can differ around midnight.
 *
 * @returns {string} The `[dd-YYYY-MM-DD]` tag for today in local time.
 */
export function todayTag() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `[dd-${date}]`;
}

export function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}
