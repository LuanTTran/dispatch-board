import { INVENTORY_STALENESS_THRESHOLD_MS } from "@/constants/dispatch";
import { ageMs } from "@/utils/staleness/formatAgeLabel";

/** Location age exceeds the inventory threshold. Uses the same 2-hour rule as truck signals. */
export function isLocationStale(
  locationAsOfTimestamp: string | Date | undefined,
  nowMs: number = Date.now(),
): boolean {
  const age = ageMs(locationAsOfTimestamp, nowMs);
  return age != null && age > INVENTORY_STALENESS_THRESHOLD_MS;
}
