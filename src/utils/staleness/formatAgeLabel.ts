import { formatDistanceToNowStrict } from "date-fns";

function toDate(value: string | Date | undefined): Date | null {
  if (value == null) {
    return null;
  }

  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Compact relative age (e.g. `40m ago`, `3h ago`) for inventory and location signals. */
export function formatAgeLabel(timestamp: string | Date | undefined): string {
  const date = toDate(timestamp);
  if (date == null) {
    return "—";
  }

  const distance = formatDistanceToNowStrict(date, {
    addSuffix: false,
    roundingMethod: "floor",
  });

  return `${distance} ago`;
}

export function ageMs(
  timestamp: string | Date | undefined,
  nowMs: number = Date.now(),
): number | null {
  const date = toDate(timestamp);
  if (date == null) {
    return null;
  }

  return nowMs - date.getTime();
}
