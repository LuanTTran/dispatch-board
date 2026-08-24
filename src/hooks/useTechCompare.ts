import {
  _osdkTruckInventory,
  _osdkWorkOrder,
  OsdkHubInventory,
} from "@dispatch-command-board/sdk";
import { useLinks, useOsdkObject, useOsdkObjects } from "@osdk/react";
import { useCallback, useMemo } from "react";

import { CHICAGO_HUB_ID } from "@/constants/dispatch";
import type { UseTechnicianPoolResult } from "@/hooks/useTechnicianPool";
import type { CompareTechData } from "@/lenses/compare/types";
import { mapCompareTech } from "@/utils/dispatch/mapCompareTech";
import type { TopPrediction } from "@/utils/dispatch/buildConfirmPayload";

export type UseTechCompareResult = {
  compareTechs: CompareTechData[];
  topPrediction: TopPrediction | null;
  confirmedTodayTechnicianIds: ReadonlySet<string>;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Compare columns for 1–2 selected techs: predictions, truck/hub path, and pool assignments. */
export function useTechCompare(
  focusedWorkOrderId: string | null,
  compareTechnicianIds: readonly string[],
  pool: UseTechnicianPoolResult,
): UseTechCompareResult {
  const {
    technicians,
    countsByTechnicianId,
    confirmedTodayTechnicianIds,
    isLoading: poolLoading,
    error: poolError,
    refetch: refetchPool,
  } = pool;

  const compareEnabled =
    focusedWorkOrderId != null && compareTechnicianIds.length > 0;

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
  const columnsEnabled = compareEnabled && predictionsReady;
  const inventoryFetchEnabled = columnsEnabled && topSkuId != null;

  const truckQuery = useMemo(
    () => ({
      where: {
        skuId: topSkuId,
        technicianId: { $in: [...compareTechnicianIds] },
      },
      pageSize: compareTechnicianIds.length,
      enabled: inventoryFetchEnabled,
    }),
    [topSkuId, compareTechnicianIds, inventoryFetchEnabled],
  );

  const {
    data: truckRows,
    isLoading: truckLoading,
    error: truckError,
    refetch: refetchTruck,
  } = useOsdkObjects(_osdkTruckInventory, truckQuery);

  const hubQuery = useMemo(
    () => ({
      where: { hubId: CHICAGO_HUB_ID, skuId: topSkuId },
      pageSize: 1,
      enabled: inventoryFetchEnabled,
    }),
    [topSkuId, inventoryFetchEnabled],
  );

  const {
    data: hubRows,
    isLoading: hubLoading,
    error: hubError,
    refetch: refetchHub,
  } = useOsdkObjects(OsdkHubInventory, hubQuery);

  const compareTechs = useMemo(() => {
    if (!columnsEnabled) {
      return [];
    }

    const skuId = topSkuId ?? "—";
    const technicianById = new Map(
      technicians.map((technician) => [technician.technicianId, technician]),
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
          assignmentsToday: countsByTechnicianId.get(technicianId) ?? 0,
        }),
      ];
    });
  }, [
    columnsEnabled,
    topSkuId,
    technicians,
    countsByTechnicianId,
    truckRows,
    hubRows,
    compareTechnicianIds,
  ]);

  const topPrediction = useMemo((): TopPrediction | null => {
    const row = predictions?.[0];
    if (row?.skuId == null) {
      return null;
    }

    return {
      skuId: row.skuId,
      confidence: row.confidence ?? 0,
    };
  }, [predictions]);

  const refetch = useCallback((): void => {
    forceUpdateWorkOrder();
    refetchTruck();
    refetchHub();
    refetchPool();
  }, [forceUpdateWorkOrder, refetchTruck, refetchHub, refetchPool]);

  const isLoading =
    compareEnabled &&
    (workOrderLoading ||
      predictionsLoading ||
      poolLoading ||
      (topSkuId != null && (truckLoading || hubLoading)));

  return {
    compareTechs,
    topPrediction,
    confirmedTodayTechnicianIds,
    isLoading,
    error: workOrderError ?? truckError ?? hubError ?? poolError,
    refetch,
  };
}
