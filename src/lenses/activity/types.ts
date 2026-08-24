/** Ontology decisionType values matching dispatch_decisions.csv. */
export type DispatchDecisionType =
  | "confirm_dispatch"
  | "hold"
  | "override_attempt"
  | "candidate_review"
  | "parts_guard_block";

/** Raw dispatch decision row mapped to dispatch_decisions.csv columns. */
export type DispatchDecisionData = {
  decisionId: string;
  workOrderId: string;
  decisionType: DispatchDecisionType;
  reason: string;
  /** ISO 8601 timestamp with offset. Demo anchor is 2026-07-29 evening rush. */
  timestamp: string;
  /** Raw ontology actor (user id, RID, or seed slug). */
  actor: string;
  /** Username (or seed Alice/Bob) for display. */
  actorLabel: string;
};

/** Visible recent rows in the activity footer strip. */
export const RECENT_DECISIONS_LIMIT = 8;

/** Page size for the activity full-log dialog. Covers demo seed data plus headroom. */
export const ACTIVITY_FULL_LOG_PAGE_SIZE = 100;
