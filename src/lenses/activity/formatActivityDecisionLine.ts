import type { DispatchDecisionData } from "@/lenses/activity/types";
import { format, parseISO } from "date-fns";

export function formatActivityActor(actor: string): string {
  const slug = actor.split(".").pop() ?? actor;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function formatActivityTime(timestamp: string): string {
  return format(parseISO(timestamp), "h:mmaaa").toLowerCase();
}

/** Headline for the full log with actor, work order, and action. No trailing time. */
export function formatActivityDecisionHeadline(decision: DispatchDecisionData): string {
  const actor = formatActivityActor(decision.actor);

  switch (decision.decisionType) {
    case "confirm_dispatch": {
      const techId = extractTechnicianId(decision.reason);
      return techId !== null
        ? `${actor} → ${decision.workOrderId} · ${techId}`
        : `${actor} → ${decision.workOrderId}`;
    }
    case "hold":
      return `${actor} held ${decision.workOrderId} — parts pick`;
    case "candidate_review":
      return `${actor} reviewed ${decision.workOrderId}`;
    case "parts_guard_block":
      return `${actor} · ${decision.workOrderId} — red path blocked`;
    case "override_attempt":
      return `${actor} · ${decision.workOrderId} — override rejected`;
    default:
      return `${actor} · ${decision.workOrderId}`;
  }
}

function extractTechnicianId(reason: string): string | null {
  const match = reason.match(/Tech-\d+/);
  return match?.[0] ?? null;
}

/** One footer ticker chip that includes time at the end. */
export function formatActivityDecisionLine(decision: DispatchDecisionData): string {
  const actor = formatActivityActor(decision.actor);
  const time = formatActivityTime(decision.timestamp);

  switch (decision.decisionType) {
    case "confirm_dispatch": {
      const techId = extractTechnicianId(decision.reason);
      return techId !== null
        ? `${actor} → ${decision.workOrderId} · ${techId} · ${time}`
        : `${actor} → ${decision.workOrderId} · ${time}`;
    }
    case "hold":
      return `${actor} held ${decision.workOrderId} — parts pick · ${time}`;
    case "candidate_review":
      return `${actor} reviewed ${decision.workOrderId} · ${time}`;
    case "parts_guard_block":
      return `${actor} · ${decision.workOrderId} — red path blocked · ${time}`;
    case "override_attempt":
      return `${actor} · ${decision.workOrderId} — override rejected · ${time}`;
    default:
      return `${actor} · ${decision.workOrderId} · ${time}`;
  }
}
