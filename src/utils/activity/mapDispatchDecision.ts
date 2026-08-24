import type { OsdkDispatchDecision } from "@dispatch-command-board/sdk";

import type {
  DispatchDecisionData,
  DispatchDecisionType,
} from "@/lenses/activity/types";
import { resolveFoundryActorLabel } from "@/utils/foundry/resolveFoundryActorLabel";

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
  usernameByUserId?: ReadonlyMap<string, string>,
): DispatchDecisionData {
  const actor = decision.actor ?? "unknown";
  return {
    decisionId: decision.decisionId,
    workOrderId: decision.workOrderId ?? "—",
    decisionType: parseDecisionType(decision.decisionType),
    reason: decision.reason ?? "",
    timestamp: decision.timestamp ?? new Date(0).toISOString(),
    actor,
    actorLabel: resolveFoundryActorLabel(actor, usernameByUserId),
  };
}

export function mapDispatchDecisions(
  decisions: readonly DispatchDecisionInstance[],
  usernameByUserId?: ReadonlyMap<string, string>,
): DispatchDecisionData[] {
  return decisions.map((decision) => mapDispatchDecision(decision, usernameByUserId));
}
