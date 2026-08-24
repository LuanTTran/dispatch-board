import { useMemo } from "react";

import { useOpenWorkOrderPoolData } from "@/hooks/useOpenWorkOrderPool";
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

/** Queue rows mapped from the shared OPEN work-order pool. */
export function useOpenWorkOrders(): UseOpenWorkOrdersResult {
  const { workOrders, isLoading, error, refetch } = useOpenWorkOrderPoolData();

  const items = useMemo(
    () => mapWorkOrdersToQueueItems(workOrders),
    [workOrders],
  );

  return {
    items,
    isLoading,
    error,
    refetch,
    sourceCount: workOrders.length,
  };
}
