/** Open queue filter values. */
export const OPEN_QUEUE_FILTER = {
  status: "unassigned",
  priority: "urgent",
  equipmentCategory: "commercial_refrigeration",
  region: "central",
} as const;

/** SLA minutes until breach, used for queue urgency styling. */
export const SLA_URGENCY_THRESHOLDS_MIN = {
  critical: 45,
  warning: 120,
} as const;

export const OPEN_QUEUE_PAGE_SIZE = 40;

/** Urgency bucket materialized on WorkOrder by flatten_timestamps. OVERDUE forces critical styling. */
export const URGENCY_BUCKET = {
  OVERDUE: "OVERDUE",
  DUE_SOON: "DUE_SOON",
  ON_TRACK: "ON_TRACK",
} as const;

export type UrgencyBucket = (typeof URGENCY_BUCKET)[keyof typeof URGENCY_BUCKET];
