import {
  SLA_URGENCY_THRESHOLDS_MIN,
  URGENCY_BUCKET,
  type UrgencyBucket,
} from "@/constants/queue";
import type { QueueUrgency } from "@/lenses/queue/types";

/** Minutes remaining until the SLA deadline. Negative when already breached. */
export function minutesUntilSla(
  slaDeadline: string | Date | undefined,
  nowMs: number = Date.now(),
): number | null {
  if (slaDeadline == null) {
    return null;
  }

  const deadlineMs =
    typeof slaDeadline === "string"
      ? new Date(slaDeadline).getTime()
      : slaDeadline.getTime();

  if (Number.isNaN(deadlineMs)) {
    return null;
  }

  return Math.floor((deadlineMs - nowMs) / 60_000);
}

/** Compact countdown label for queue rows (e.g. `42m`, `1h`, `2h20`). */
export function formatSlaLabel(
  slaDeadline: string | Date | undefined,
  nowMs: number = Date.now(),
): string {
  const minutesRemaining = minutesUntilSla(slaDeadline, nowMs);
  if (minutesRemaining == null) {
    return "—";
  }
  if (minutesRemaining <= 0) {
    return "breached";
  }
  if (minutesRemaining < 60) {
    return `${minutesRemaining}m`;
  }

  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;
  return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
}

export function classifyQueueUrgency(
  slaDeadline: string | Date | undefined,
  nowMs: number = Date.now(),
): QueueUrgency {
  const minutesRemaining = minutesUntilSla(slaDeadline, nowMs);
  if (minutesRemaining == null) {
    return "normal";
  }
  if (minutesRemaining <= SLA_URGENCY_THRESHOLDS_MIN.critical) {
    return "critical";
  }
  if (minutesRemaining <= SLA_URGENCY_THRESHOLDS_MIN.warning) {
    return "warning";
  }
  return "normal";
}

/**
 * Maps ontology urgency bucket to queue/map styling.
 * OVERDUE is always critical. DUE_SOON/ON_TRACK still run live SLA math so
 * jobs inside the critical window (e.g. 1m left) paint red, not yellow.
 */
export function mapUrgencyBucketToQueueUrgency(
  urgencyBucket: string | undefined,
  slaDeadline: string | Date | undefined,
  nowMs: number = Date.now(),
): QueueUrgency {
  if ((urgencyBucket as UrgencyBucket | undefined) === URGENCY_BUCKET.OVERDUE) {
    return "critical";
  }

  return classifyQueueUrgency(slaDeadline, nowMs);
}
