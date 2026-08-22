import {
  _osdkWorkOrder,
  OsdkHubInventory,
} from "@dispatch-command-board/sdk";
import { useLinks, useOsdkObject, useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import { CHICAGO_HUB_ID } from "@/constants/dispatch";
import type { JobCardData } from "@/lenses/operations/types";
import { mapFocusedJob } from "@/utils/operations/mapFocusedJob";

type UseFocusedJobResult = {
  job: JobCardData | null;
  isLoading: boolean;
  error: Error | undefined;
};

/** Focused work order job card with WorkOrder instance and investigative links for the operations panel. */
export function useFocusedJob(workOrderId: string | null): UseFocusedJobResult {
  const isEnabled = workOrderId != null;

  const {
    object: workOrder,
    isLoading: workOrderLoading,
    error: workOrderError,
  } = useOsdkObject(_osdkWorkOrder, workOrderId ?? "", {
    enabled: isEnabled,
  });

  const { links: customerSites, isLoading: siteLoading } = useLinks(
    workOrder,
    "osdkCustomerSite",
    { enabled: workOrder != null },
  );

  const { links: equipmentRows, isLoading: equipmentLoading } = useLinks(
    workOrder,
    "osdkEquipment",
    { enabled: workOrder != null },
  );

  const { links: predictions, isLoading: predictionsLoading } = useLinks(
    workOrder,
    "_osdkPartPredictions",
    {
      orderBy: { rank: "asc" },
      enabled: workOrder != null,
    },
  );

  const { links: priorDecisions, isLoading: decisionsLoading } = useLinks(
    workOrder,
    "osdkDispatchDecisions",
    {
      orderBy: { timestamp: "desc" },
      enabled: workOrder != null,
    },
  );

  const topSkuId = predictions?.[0]?.skuId;
  const hubQueryEnabled = topSkuId != null;

  const { data: hubInventoryRows, isLoading: hubLoading } = useOsdkObjects(
    OsdkHubInventory,
    {
      where: { hubId: CHICAGO_HUB_ID, skuId: topSkuId },
      pageSize: 1,
      enabled: hubQueryEnabled,
    },
  );

  const job = useMemo(() => {
    if (workOrder == null) {
      return null;
    }

    return mapFocusedJob({
      workOrder,
      customerSite: customerSites?.[0],
      equipment: equipmentRows?.[0],
      predictions: predictions ?? [],
      hubInventory: hubInventoryRows?.[0],
      priorDecisions: priorDecisions ?? [],
    });
  }, [
    workOrder,
    customerSites,
    equipmentRows,
    predictions,
    hubInventoryRows,
    priorDecisions,
  ]);

  const isLoading =
    workOrderLoading ||
    siteLoading ||
    equipmentLoading ||
    predictionsLoading ||
    decisionsLoading ||
    (hubQueryEnabled && hubLoading);

  return {
    job,
    isLoading: isEnabled && isLoading,
    error: workOrderError,
  };
}
