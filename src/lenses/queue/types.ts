/** View model for one OPEN queue row, mapped from WorkOrder in useOpenWorkOrders. */
export type QueueUrgency = "critical" | "warning" | "normal";

export type QueueListItemData = {
  workOrderId: string;
  slaLabel: string;
  urgency: QueueUrgency;
};
