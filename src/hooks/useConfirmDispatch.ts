import { confirmDispatch } from "@dispatch-command-board/sdk";
import { useOsdkAction } from "@osdk/react";

/** Governed assign action. Requires human confirm after parts compare review. */
export function useConfirmDispatch() {
  const { applyAction, isPending, error, data } = useOsdkAction(confirmDispatch);

  return {
    confirmDispatch: applyAction,
    isPending,
    error,
    data,
  };
}
