import type { OsdkDispatchDecision } from "@dispatch-command-board/sdk";

import type {
  DispatchDecisionData,
  DispatchDecisionType,
} from "@/lenses/activity/types";

type DispatchDecisionInstance = OsdkDispatchDecision.OsdkInstance;

const DECISION_TYPES = new Set<DispatchDecisionType>([
  "confirm_dispatch",
  "hold",
  "override_attempt",
  "candidate_review",
  "parts_guard_block",
]);

function parseDecisionType(value: string | undefined): DispatchDecisionType {
  if (value != null && DECISION_TYPES.has(value as DispatchDecisionType)) {
    return value as DispatchDecisionType;
  }

  return "confirm_dispatch";
}

/** Maps OSDK DispatchDecision to an activity feed row. */
export function mapDispatchDecision(
  decision: DispatchDecisionInstance,
): DispatchDecisionData {
  return {
    decisionId: decision.decisionId,
    workOrderId: decision.workOrderId ?? "—",
    decisionType: parseDecisionType(decision.decisionType),
    reason: decision.reason ?? "",
    timestamp: decision.timestamp ?? new Date(0).toISOString(),
    actor: decision.actor ?? "unknown",
  };
}

export function mapDispatchDecisions(
  decisions: readonly DispatchDecisionInstance[],
): DispatchDecisionData[] {
  return decisions.map(mapDispatchDecision);
}
