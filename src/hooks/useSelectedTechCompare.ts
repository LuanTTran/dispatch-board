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
import { computeJobsLeft } from "@/utils/dispatch/jobsLeftPresentation";
import { mapCompareTech } from "@/utils/dispatch/mapCompareTech";
import type { TopPrediction } from "@/utils/dispatch/buildConfirmPayload";

type UseSelectedTechCompareResult = {
  compareTech: CompareTechData | null;
  topPrediction: TopPrediction | null;
  jobsLeft: number | null;
  hasConfirmedAssignmentToday: boolean;
  isLoading: boolean;
  error: Error | undefined;
};

/** One assign-target column with work order predictions and truck or hub path for the confirm dialog. */
export function useSelectedTechCompare(
  focusedWorkOrderId: string | null,
  selectedTechnicianId: string | null,
): UseSelectedTechCompareResult {
  const queryEnabled =
    focusedWorkOrderId != null && selectedTechnicianId != null;

  const {
    object: workOrder,
    isLoading: workOrderLoading,
    error: workOrderError,
  } = useOsdkObject(_osdkWorkOrder, focusedWorkOrderId ?? "", {
    enabled: queryEnabled,
  });

  const { links: predictions, isLoading: predictionsLoading } = useLinks(
    workOrder,
    "_osdkPartPredictions",
    {
      orderBy: { rank: "asc" },
      enabled: workOrder != null,
    },
  );

  const topPredictionRow = predictions?.[0];
  const topSkuId = topPredictionRow?.skuId;
  const predictionsReady = workOrder != null && !predictionsLoading;
  const inventoryFetchEnabled = queryEnabled && predictionsReady && topSkuId != null;

  const {
    data: technicians,
    isLoading: techniciansLoading,
    error: techniciansError,
  } = useOsdkObjects(_osdkTechnician, {
    where: { technicianId: selectedTechnicianId ?? "" },
    pageSize: 1,
    enabled: queryEnabled && predictionsReady,
  });

  const {
    data: truckRows,
    isLoading: truckLoading,
    error: truckError,
  } = useOsdkObjects(_osdkTruckInventory, {
    where: {
      skuId: topSkuId,
      technicianId: selectedTechnicianId ?? "",
    },
    pageSize: 1,
    enabled: inventoryFetchEnabled,
  });

  const {
    data: hubRows,
    isLoading: hubLoading,
    error: hubError,
  } = useOsdkObjects(OsdkHubInventory, {
    where: { hubId: CHICAGO_HUB_ID, skuId: topSkuId },
    pageSize: 1,
    enabled: inventoryFetchEnabled,
  });

  const {
    countsByTechnicianId,
    confirmedTodayTechnicianIds,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useTechnicianAssignmentCounts();

  const compareTech = useMemo(() => {
    if (!queryEnabled || !predictionsReady) {
      return null;
    }

    const technician = technicians?.[0];
    if (technician == null) {
      return null;
    }

    const skuId = topSkuId ?? "—";
    const truckRow = truckRows?.[0];
    const hubRow = hubRows?.[0];

    return mapCompareTech({
      technician,
      skuId,
      truckInventory:
        truckRow != null
          ? {
              quantity: Number(truckRow.quantity ?? 0),
              asOfTimestamp: truckRow.asOfTimestamp,
            }
          : undefined,
      hubInventory:
        hubRow != null
          ? {
              quantity: Number(hubRow.quantity ?? 0),
              asOfTimestamp: hubRow.asOfTimestamp,
            }
          : undefined,
      assignmentsToday:
        countsByTechnicianId.get(technician.technicianId) ?? 0,
    });
  }, [
    queryEnabled,
    predictionsReady,
    technicians,
    topSkuId,
    truckRows,
    hubRows,
    countsByTechnicianId,
  ]);

  const topPrediction = useMemo((): TopPrediction | null => {
    if (topPredictionRow?.skuId == null) {
      return null;
    }

    return {
      skuId: topPredictionRow.skuId,
      confidence: topPredictionRow.confidence ?? 0,
    };
  }, [topPredictionRow]);

  const jobsLeft = useMemo(() => {
    const technician = technicians?.[0];
    if (technician == null) {
      return null;
    }

    return computeJobsLeft(
      technician.maxDailyJobs,
      countsByTechnicianId.get(technician.technicianId) ?? 0,
    );
  }, [technicians, countsByTechnicianId]);

  const hasConfirmedAssignmentToday =
    selectedTechnicianId != null &&
    confirmedTodayTechnicianIds.has(selectedTechnicianId);

  const isLoading =
    queryEnabled &&
    (workOrderLoading ||
      predictionsLoading ||
      techniciansLoading ||
      assignmentsLoading ||
      (topSkuId != null && (truckLoading || hubLoading)));

  return {
    compareTech,
    topPrediction,
    jobsLeft,
    hasConfirmedAssignmentToday,
    isLoading,
    error:
      workOrderError ??
      techniciansError ??
      truckError ??
      hubError ??
      assignmentsError,
  };
}
