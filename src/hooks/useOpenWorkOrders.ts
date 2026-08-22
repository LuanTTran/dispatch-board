import { _osdkWorkOrder } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import {
  OPEN_QUEUE_FILTER,
  OPEN_QUEUE_PAGE_SIZE,
} from "@/constants/queue";
import type { QueueListItemData } from "@/lenses/queue/types";
import { mapWorkOrdersToQueueItems } from "@/utils/queue/mapWorkOrderToQueueItem";

type UseOpenWorkOrdersResult = {
  items: QueueListItemData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
  /** Raw OSDK row count before view-model mapping. Useful for connection smoke tests. */
  sourceCount: number;
};

/** Fetches OPEN urgent work orders from OSDK. Triggers OAuth when unauthenticated. */
export function useOpenWorkOrders(): UseOpenWorkOrdersResult {
  const { data, isLoading, error, refetch } = useOsdkObjects(_osdkWorkOrder, {
    where: { ...OPEN_QUEUE_FILTER },
    orderBy: { slaDeadline: "asc" },
    pageSize: OPEN_QUEUE_PAGE_SIZE,
  });

  const items = useMemo(
    () => mapWorkOrdersToQueueItems(data ?? []),
    [data],
  );

  return {
    items,
    isLoading,
    error,
    refetch,
    sourceCount: data?.length ?? 0,
  };
}
