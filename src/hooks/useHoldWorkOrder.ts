import { holdWorkOrder } from "@dispatch-command-board/sdk";
import { useOsdkAction } from "@osdk/react";

/** Places a work order on hold for hub parts pick and logs an audit decision. */
export function useHoldWorkOrder() {
  const { applyAction, isPending, error, data } = useOsdkAction(holdWorkOrder);

  return {
    holdWorkOrder: applyAction,
    isPending,
    error,
    data,
  };
}
