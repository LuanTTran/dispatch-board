import type { DispatchDecisionData } from "@/lenses/activity/types";
import { format, parseISO } from "date-fns";

export function formatActivityTime(timestamp: string): string {
  return format(parseISO(timestamp), "h:mmaaa").toLowerCase();
}

/** Headline for the full log: username → work order. Time and reason render separately. */
export function formatActivityDecisionHeadline(decision: DispatchDecisionData): string {
  return `${decision.actorLabel} → ${decision.workOrderId}`;
}

/** One footer ticker chip that includes time at the end. */
export function formatActivityDecisionLine(decision: DispatchDecisionData): string {
  const time = formatActivityTime(decision.timestamp);
  return `${decision.actorLabel} → ${decision.workOrderId} · ${time}`;
}
