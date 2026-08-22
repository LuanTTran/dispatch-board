import type { DispatchDecisionType } from "@/lenses/activity/types";

type DecisionTypeMeta = {
  label: string;
  badgeClassName: string;
};

/** Badge copy and color per decisionType for full log scanability. */
export const DECISION_TYPE_META: Record<DispatchDecisionType, DecisionTypeMeta> = {
  confirm_dispatch: {
    label: "Assign",
    badgeClassName: "bg-status-success-muted text-status-success-foreground",
  },
  hold: {
    label: "Hold",
    badgeClassName: "bg-status-warning-muted text-status-warning-foreground",
  },
  candidate_review: {
    label: "Review",
    badgeClassName: "bg-status-info-muted text-status-info-foreground",
  },
  parts_guard_block: {
    label: "Blocked",
    badgeClassName: "bg-status-danger-muted text-status-danger-foreground",
  },
  override_attempt: {
    label: "Override",
    badgeClassName: "bg-status-delayed-muted text-status-delayed-foreground",
  },
};
