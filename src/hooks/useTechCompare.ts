import {
  _osdkTechnician,
  _osdkTruckInventory,
  _osdkWorkOrder,
  OsdkHubInventory,
} from "@dispatch-command-board/sdk";
import { useLinks, useOsdkObject, useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import { CHICAGO_HUB_ID } from "@/constants/dispatch";
import type { CompareTechData } from "@/lenses/compare/types";
import { useTechnicianAssignmentCounts } from "@/hooks/useTechnicianAssignmentCounts";
import { mapCompareTech } from "@/utils/dispatch/mapCompareTech";

type UseTechCompareResult = {
  compareTechs: CompareTechData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Side-by-side compare columns with work order predictions, per-tech truck rows, and a shared hub row. */
export function useTechCompare(
  focusedWorkOrderId: string | null,
  compareTechnicianIds: readonly string[],
): UseTechCompareResult {
  const compareEnabled =
    focusedWorkOrderId != null && compareTechnicianIds.length > 0;
  const inventoryEnabled = compareEnabled && compareTechnicianIds.length === 2;

  const {
    object: workOrder,
    isLoading: workOrderLoading,
    error: workOrderError,
    forceUpdate: forceUpdateWorkOrder,
  } = useOsdkObject(_osdkWorkOrder, focusedWorkOrderId ?? "", {
    enabled: compareEnabled,
  });

  const { links: predictions, isLoading: predictionsLoading } = useLinks(
    workOrder,
    "_osdkPartPredictions",
    {
      orderBy: { rank: "asc" },
      enabled: workOrder != null,
    },
  );

  const topSkuId = predictions?.[0]?.skuId;
  const predictionsReady = workOrder != null && !predictionsLoading;
  const stripEnabled = inventoryEnabled && predictionsReady;
  const inventoryFetchEnabled = stripEnabled && topSkuId != null;

  const {
    data: technicians,
    isLoading: techniciansLoading,
    error: techniciansError,
    refetch: refetchTechnicians,
  } = useOsdkObjects(_osdkTechnician, {
    where: { technicianId: { $in: [...compareTechnicianIds] } },
    pageSize: compareTechnicianIds.length,
    enabled: stripEnabled,
  });

  const {
    data: truckRows,
    isLoading: truckLoading,
    error: truckError,
    refetch: refetchTruck,
  } = useOsdkObjects(_osdkTruckInventory, {
    where: {
      skuId: topSkuId,
      technicianId: { $in: [...compareTechnicianIds] },
    },
    pageSize: compareTechnicianIds.length,
    enabled: inventoryFetchEnabled,
  });

  const {
    data: hubRows,
    isLoading: hubLoading,
    error: hubError,
    refetch: refetchHub,
  } = useOsdkObjects(OsdkHubInventory, {
    where: { hubId: CHICAGO_HUB_ID, skuId: topSkuId },
    pageSize: 1,
    enabled: inventoryFetchEnabled,
  });

  const {
    countsByTechnicianId,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useTechnicianAssignmentCounts();

  const compareTechs = useMemo(() => {
    if (!stripEnabled) {
      return [];
    }

    const skuId = topSkuId ?? "—";
    const technicianById = new Map(
      (technicians ?? []).map((technician) => [
        technician.technicianId,
        technician,
      ]),
    );
    const truckByTechnicianId = new Map(
      (truckRows ?? []).map((row) => [row.technicianId, row]),
    );
    const hubRow = hubRows?.[0];
    const hubInventory =
      hubRow != null
        ? {
            quantity: Number(hubRow.quantity ?? 0),
            asOfTimestamp: hubRow.asOfTimestamp,
          }
        : undefined;

    return compareTechnicianIds.flatMap((technicianId) => {
      const technician = technicianById.get(technicianId);
      if (technician == null) {
        return [];
      }

      const truckRow = truckByTechnicianId.get(technicianId);
      const truckInventory =
        truckRow != null
          ? {
              quantity: Number(truckRow.quantity ?? 0),
              asOfTimestamp: truckRow.asOfTimestamp,
            }
          : undefined;

      return [
        mapCompareTech({
          technician,
          skuId,
          truckInventory,
          hubInventory,
          assignmentsToday:
            countsByTechnicianId.get(technicianId) ?? 0,
        }),
      ];
    });
  }, [
    stripEnabled,
    topSkuId,
    technicians,
    truckRows,
    hubRows,
    compareTechnicianIds,
    countsByTechnicianId,
  ]);

  const refetch = (): void => {
    forceUpdateWorkOrder();
    refetchTechnicians();
    refetchTruck();
    refetchHub();
    refetchAssignments();
  };

  const isLoading =
    compareEnabled &&
    (workOrderLoading ||
      predictionsLoading ||
      (inventoryEnabled &&
        (techniciansLoading ||
          assignmentsLoading ||
          (topSkuId != null && (truckLoading || hubLoading)))));

  return {
    compareTechs,
    isLoading,
    error:
      workOrderError ??
      techniciansError ??
      truckError ??
      hubError ??
      assignmentsError,
    refetch,
  };
}
