import { _osdkWorkOrder, OsdkCustomerSite } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import {
  OPEN_QUEUE_FILTER,
  OPEN_QUEUE_PAGE_SIZE,
} from "@/constants/queue";
import { CUSTOMER_SITES_PAGE_SIZE } from "@/constants/spatial";
import type { MapSiteData } from "@/spatial/types";
import { buildMapSitesFromOntology } from "@/utils/spatial/mapMapSite";

type UseMapSitesResult = {
  sites: MapSiteData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Site pins reuse the OPEN queue WorkOrder cache and join CustomerSite by siteId. */
export function useMapSites(): UseMapSitesResult {
  const {
    data: workOrders,
    isLoading: workOrdersLoading,
    error: workOrdersError,
    refetch: refetchWorkOrders,
  } = useOsdkObjects(_osdkWorkOrder, {
    where: { ...OPEN_QUEUE_FILTER },
    orderBy: { slaDeadline: "asc" },
    pageSize: OPEN_QUEUE_PAGE_SIZE,
  });

  const {
    data: customerSites,
    isLoading: customerSitesLoading,
    error: customerSitesError,
    refetch: refetchCustomerSites,
  } = useOsdkObjects(OsdkCustomerSite, {
    pageSize: CUSTOMER_SITES_PAGE_SIZE,
  });

  const sites = useMemo(
    () => buildMapSitesFromOntology(workOrders ?? [], customerSites ?? []),
    [workOrders, customerSites],
  );

  const refetch = (): void => {
    refetchWorkOrders();
    refetchCustomerSites();
  };

  return {
    sites,
    isLoading: workOrdersLoading || customerSitesLoading,
    error: workOrdersError ?? customerSitesError,
    refetch,
  };
}
