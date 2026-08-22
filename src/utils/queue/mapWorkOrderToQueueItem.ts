import type { _osdkWorkOrder } from "@dispatch-command-board/sdk";

import type { QueueListItemData } from "@/lenses/queue/types";
import {
  formatSlaLabel,
  mapUrgencyBucketToQueueUrgency,
} from "@/utils/queue/slaPresentation";

type WorkOrderInstance = _osdkWorkOrder.OsdkInstance;

/** Maps an OSDK WorkOrder instance to a queue row view model. */
export function mapWorkOrderToQueueItem(
  workOrder: WorkOrderInstance,
  nowMs: number = Date.now(),
): QueueListItemData {
  return {
    workOrderId: workOrder.workOrderId,
    slaLabel: formatSlaLabel(workOrder.slaDeadline, nowMs),
    urgency: mapUrgencyBucketToQueueUrgency(
      workOrder.urgencyBucket,
      workOrder.slaDeadline,
      nowMs,
    ),
  };
}

export function mapWorkOrdersToQueueItems(
  workOrders: readonly WorkOrderInstance[],
  nowMs: number = Date.now(),
): QueueListItemData[] {
  return workOrders.map((workOrder) => mapWorkOrderToQueueItem(workOrder, nowMs));
}
