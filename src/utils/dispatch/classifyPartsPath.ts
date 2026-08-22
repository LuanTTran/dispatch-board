import type { PartsPathStatus } from "@/lenses/compare/types";
import { formatAgeLabel, ageMs } from "@/utils/staleness/formatAgeLabel";
import { isInventoryStale } from "@/utils/staleness/isInventoryStale";

export type InventorySnapshot = {
  quantity: number;
  asOfTimestamp: string | Date | undefined;
};

export type ClassifyPartsPathInput = {
  skuId: string;
  truck: InventorySnapshot | undefined;
  hub: InventorySnapshot | undefined;
  nowMs?: number;
};

export type ClassifiedPartsPath = {
  status: PartsPathStatus;
  statusLabel: string;
  sourceLabel: string;
  skuId: string;
  quantity: number;
  asOfLabel: string;
  supplementLabel?: string;
  truckInventoryStale: boolean;
};

const STATUS_LABELS: Record<PartsPathStatus, string> = {
  green: "GREEN",
  yellow: "YELLOW",
  red: "RED",
};

function formatCompactAge(
  timestamp: string | Date | undefined,
  nowMs: number,
): string {
  const age = ageMs(timestamp, nowMs);
  if (age == null) {
    return "—";
  }

  const hours = Math.floor(age / (60 * 60 * 1000));
  if (hours >= 1) {
    return `${hours}h`;
  }

  const minutes = Math.floor(age / (60 * 1000));
  return `${minutes}m`;
}

function truckQuantity(truck: InventorySnapshot | undefined): number {
  return truck?.quantity ?? 0;
}

function hubQuantity(hub: InventorySnapshot | undefined): number {
  return hub?.quantity ?? 0;
}

function buildTruckSupplementLabel(
  truck: InventorySnapshot | undefined,
  nowMs: number,
): string {
  const qty = truckQuantity(truck);
  if (truck == null) {
    return "Truck 0";
  }

  const stale = isInventoryStale(truck.asOfTimestamp, nowMs);
  if (!stale) {
    return `Truck ${qty}`;
  }

  return `Truck ${qty} · ${formatCompactAge(truck.asOfTimestamp, nowMs)}`;
}

/**
 * Classifies parts path as green, yellow, or red.
 * Stale truck inventory is never green. Hub row is shared across compare columns.
 *
 * GREEN: truck qty > 0 and truck asOf fresh (≤ 2h)
 * YELLOW: hub qty > 0 (truck missing, zero, or stale)
 * RED: neither path is viable
 */
export function classifyPartsPath({
  skuId,
  truck,
  hub,
  nowMs = Date.now(),
}: ClassifyPartsPathInput): ClassifiedPartsPath {
  const truckQty = truckQuantity(truck);
  const hubQty = hubQuantity(hub);
  const truckStale =
    truck != null && isInventoryStale(truck.asOfTimestamp, nowMs);
  const truckViable = truckQty > 0 && !truckStale;

  if (truckViable) {
    return {
      status: "green",
      statusLabel: STATUS_LABELS.green,
      sourceLabel: "TRUCK",
      skuId,
      quantity: truckQty,
      asOfLabel: formatAgeLabel(truck?.asOfTimestamp),
      truckInventoryStale: false,
    };
  }

  if (hubQty > 0) {
    return {
      status: "yellow",
      statusLabel: STATUS_LABELS.yellow,
      sourceLabel: "HUB ONLY",
      skuId,
      quantity: hubQty,
      asOfLabel: formatAgeLabel(hub?.asOfTimestamp),
      supplementLabel: buildTruckSupplementLabel(truck, nowMs),
      truckInventoryStale: truckStale,
    };
  }

  return {
    status: "red",
    statusLabel: STATUS_LABELS.red,
    sourceLabel: "UNAVAILABLE",
    skuId,
    quantity: 0,
    asOfLabel: formatAgeLabel(hub?.asOfTimestamp ?? truck?.asOfTimestamp),
    supplementLabel:
      truck != null ? buildTruckSupplementLabel(truck, nowMs) : undefined,
    truckInventoryStale: truckStale,
  };
}
