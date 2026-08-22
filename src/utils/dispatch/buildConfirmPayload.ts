import { requiresAcknowledgment } from "@/dispatch/confirmDispatchGuards";
import type { ConfirmDispatchPayload } from "@/dispatch/types";
import type { CompareTechData } from "@/lenses/compare/types";
import type { JobCardData } from "@/lenses/operations/types";

function formatPartPathSummary(partsPath: CompareTechData["partsPath"]): string {
  const source =
    partsPath.sourceLabel === "TRUCK"
      ? "Truck"
      : partsPath.sourceLabel === "HUB ONLY"
        ? "Hub only"
        : partsPath.sourceLabel;

  return `${source} · ${partsPath.skuId} · qty ${partsPath.quantity} · asOf ${partsPath.asOfLabel}`;
}

function isPartsPathStale(compareTech: CompareTechData): boolean {
  return (
    compareTech.truckInventoryStale === true ||
    compareTech.locationStale === true
  );
}

export type TopPrediction = {
  skuId: string;
  confidence: number;
};

/** Builds confirm dialog payload from focused job, compare column, and rank-1 prediction. */
export function buildConfirmPayload(
  focusedJob: JobCardData,
  compareTech: CompareTechData,
  topPrediction: TopPrediction | null,
): ConfirmDispatchPayload {
  const partsPathStatus = compareTech.partsPath.status;
  const requiresOverride = partsPathStatus === "red";
  const isStale = isPartsPathStale(compareTech);
  const predictionConfidence = topPrediction?.confidence ?? 1;

  const payload: ConfirmDispatchPayload = {
    workOrderId: focusedJob.workOrderId,
    technicianId: compareTech.technicianId,
    selectedPartSkuId: requiresOverride ? "" : compareTech.partsPath.skuId,
    partPathSummary: formatPartPathSummary(compareTech.partsPath),
    partsPathStatus,
    predictionConfidence,
    isStale,
    requiresAck: false,
    requiresOverride,
  };

  payload.requiresAck = requiresAcknowledgment(payload);

  return payload;
}
