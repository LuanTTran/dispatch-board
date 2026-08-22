import type { confirmDispatch } from "@dispatch-command-board/sdk";

import type { ConfirmDispatchPayload } from "@/dispatch/types";

/** Maps confirm dialog payload to governed ConfirmDispatch action arguments. */
export function buildConfirmDispatchActionParams(
  payload: ConfirmDispatchPayload,
  overrideReason: string,
): confirmDispatch.Params {
  if (payload.requiresOverride) {
    return {
      workOrderId: payload.workOrderId,
      technicianId: payload.technicianId,
      overrideReason,
    };
  }

  return {
    workOrderId: payload.workOrderId,
    technicianId: payload.technicianId,
    selectedPartSkuId: payload.selectedPartSkuId,
  };
}
