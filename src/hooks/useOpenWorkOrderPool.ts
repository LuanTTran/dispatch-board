import { _osdkWorkOrder } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { createContext, useContext } from "react";

import {
  OPEN_QUEUE_FILTER,
  OPEN_QUEUE_PAGE_SIZE,
} from "@/constants/queue";

const OPEN_WORK_ORDER_QUERY = {
  where: { ...OPEN_QUEUE_FILTER },
  orderBy: { slaDeadline: "asc" } as const,
  pageSize: OPEN_QUEUE_PAGE_SIZE,
};

const EMPTY_WORK_ORDERS: _osdkWorkOrder.OsdkInstance[] = [];

export type UseOpenWorkOrderPoolResult = {
  workOrders: _osdkWorkOrder.OsdkInstance[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

export const OpenWorkOrderPoolContext =
  createContext<UseOpenWorkOrderPoolResult | null>(null);

/** OPEN urgent work orders shared by the queue list and map site pins. */
export function useOpenWorkOrderPool(): UseOpenWorkOrderPoolResult {
  const { data, isLoading, error, refetch } = useOsdkObjects(
    _osdkWorkOrder,
    OPEN_WORK_ORDER_QUERY,
  );

  return {
    workOrders: data ?? EMPTY_WORK_ORDERS,
    isLoading,
    error,
    refetch,
  };
}

export function useOpenWorkOrderPoolData(): UseOpenWorkOrderPoolResult {
  const context = useContext(OpenWorkOrderPoolContext);
  if (context === null) {
    throw new Error(
      "useOpenWorkOrderPoolData must be used within OpenWorkOrderPoolProvider",
    );
  }
  return context;
}
