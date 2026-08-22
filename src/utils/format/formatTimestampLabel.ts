import { format } from "date-fns";

/** Formats timestamps for prior decision rows in the job details expander. */
export function formatTimestampLabel(timestamp: string | Date | undefined): string {
  if (timestamp == null) {
    return "—";
  }

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return format(date, "MMM d h:mma");
}
