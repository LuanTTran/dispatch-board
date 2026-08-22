import type { QueueUrgency } from "@/lenses/queue/types";
import type { MapSiteWorkOrder } from "@/spatial/types";

const URGENCY_RANK: Record<QueueUrgency, number> = {
  critical: 0,
  warning: 1,
  normal: 2,
};

/** Pin fill and border CSS classes. DivIcon HTML cannot use Tailwind. */
export const siteUrgencyPinClass: Record<QueueUrgency, string> = {
  critical: "site-marker-pin--critical",
  warning: "site-marker-pin--warning",
  normal: "site-marker-pin--normal",
};

/** Highest SLA pressure among work orders at a site drives the default pin color. */
export function getPeakSiteUrgency(workOrders: MapSiteWorkOrder[]): QueueUrgency {
  return workOrders.reduce<QueueUrgency>(
    (peak, wo) => (URGENCY_RANK[wo.urgency] < URGENCY_RANK[peak] ? wo.urgency : peak),
    "normal",
  );
}
