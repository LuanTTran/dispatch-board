import { INVENTORY_STALENESS_THRESHOLD_MS } from "@/constants/dispatch";

import { ageMs } from "@/utils/staleness/formatAgeLabel";

/** Operational freshness label for hub and truck inventory as-of timestamps. */
export function classifyInventoryStalenessLabel(
  asOfTimestamp: string | Date | undefined,
  nowMs: number = Date.now(),
): string {
  const age = ageMs(asOfTimestamp, nowMs);
  if (age == null) {
    return "Unknown";
  }

  return age <= INVENTORY_STALENESS_THRESHOLD_MS ? "Fresh" : "Stale";
}
