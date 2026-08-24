import { OsdkCustomerSite } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useCallback, useMemo } from "react";

import { CUSTOMER_SITES_PAGE_SIZE } from "@/constants/spatial";
import { useOpenWorkOrderPoolData } from "@/hooks/useOpenWorkOrderPool";
import type { MapSiteData } from "@/spatial/types";
import { buildMapSitesFromOntology } from "@/utils/spatial/mapMapSite";

const CUSTOMER_SITES_QUERY = {
  pageSize: CUSTOMER_SITES_PAGE_SIZE,
};

type UseMapSitesResult = {
  sites: MapSiteData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Site pins join the shared OPEN work-order pool with CustomerSite by siteId. */
export function useMapSites(): UseMapSitesResult {
  const {
    workOrders,
    isLoading: workOrdersLoading,
    error: workOrdersError,
    refetch: refetchWorkOrders,
  } = useOpenWorkOrderPoolData();

  const {
    data: customerSites,
    isLoading: customerSitesLoading,
    error: customerSitesError,
    refetch: refetchCustomerSites,
  } = useOsdkObjects(OsdkCustomerSite, CUSTOMER_SITES_QUERY);

  const sites = useMemo(
    () => buildMapSitesFromOntology(workOrders, customerSites ?? []),
    [workOrders, customerSites],
  );

  const refetch = useCallback((): void => {
    refetchWorkOrders();
    refetchCustomerSites();
  }, [refetchWorkOrders, refetchCustomerSites]);

  return {
    sites,
    isLoading: workOrdersLoading || customerSitesLoading,
    error: workOrdersError ?? customerSitesError,
    refetch,
  };
}
