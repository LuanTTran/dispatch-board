import type { ConfirmDispatchPayload } from "@/dispatch/types";

/** Minimum rank-1 prediction confidence that requires explicit acknowledgment before confirm. */
export const LOW_CONFIDENCE_THRESHOLD = 0.5;

export function requiresStaleAck(payload: Pick<ConfirmDispatchPayload, "isStale">): boolean {
  return payload.isStale;
}

export function requiresLowConfidenceAck(
  payload: Pick<ConfirmDispatchPayload, "predictionConfidence">,
): boolean {
  return payload.predictionConfidence < LOW_CONFIDENCE_THRESHOLD;
}

export function requiresAcknowledgment(payload: ConfirmDispatchPayload): boolean {
  return requiresStaleAck(payload) || requiresLowConfidenceAck(payload);
}

export function canConfirmDispatch(params: {
  payload: ConfirmDispatchPayload;
  acknowledged: boolean;
  overrideReason: string;
}): boolean {
  const { payload, acknowledged, overrideReason } = params;

  if (payload.requiresOverride && overrideReason.trim().length === 0) {
    return false;
  }

  if (payload.requiresAck && !acknowledged) {
    return false;
  }

  return true;
}
