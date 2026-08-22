/** Tracks where the operator last set focusedWorkOrderId. Drives map popup mode. */
export type WorkOrderFocusSource = "queue" | "map";

export type SetFocusedWorkOrderOptions = {
  source?: WorkOrderFocusSource;
};
