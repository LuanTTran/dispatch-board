import { INVENTORY_STALENESS_THRESHOLD_MS } from "@/constants/dispatch";
import { ageMs } from "@/utils/staleness/formatAgeLabel";

/** Truck or hub inventory age exceeds the threshold. Uses the same 2-hour rule as location. */
export function isInventoryStale(
  asOfTimestamp: string | Date | undefined,
  nowMs: number = Date.now(),
): boolean {
  const age = ageMs(asOfTimestamp, nowMs);
  return age != null && age > INVENTORY_STALENESS_THRESHOLD_MS;
}