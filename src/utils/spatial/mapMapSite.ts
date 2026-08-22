import type { _osdkWorkOrder, OsdkCustomerSite } from "@dispatch-command-board/sdk";

import type { MapSiteData, MapSiteWorkOrder } from "@/spatial/types";
import {
  formatSlaLabel,
  mapUrgencyBucketToQueueUrgency,
} from "@/utils/queue/slaPresentation";

type WorkOrderInstance = _osdkWorkOrder.OsdkInstance;
type CustomerSiteInstance = OsdkCustomerSite.OsdkInstance;

function mapWorkOrderToSitePopupRow(
  workOrder: WorkOrderInstance,
  nowMs: number,
): MapSiteWorkOrder {
  return {
    workOrderId: workOrder.workOrderId,
    slaLabel: formatSlaLabel(workOrder.slaDeadline, nowMs),
    symptomOneLiner: workOrder.symptom ?? "—",
    urgency: mapUrgencyBucketToQueueUrgency(
      workOrder.urgencyBucket,
      workOrder.slaDeadline,
      nowMs,
    ),
  };
}

/** Groups open urgent work orders by CustomerSite for map site pins. */
export function buildMapSitesFromOntology(
  workOrders: readonly WorkOrderInstance[],
  customerSites: readonly CustomerSiteInstance[],
  nowMs: number = Date.now(),
): MapSiteData[] {
  const siteById = new Map(
    customerSites.map((site) => [site.siteId, site] as const),
  );
  const workOrdersBySiteId = new Map<string, MapSiteWorkOrder[]>();

  for (const workOrder of workOrders) {
    const siteId = workOrder.siteId;
    if (siteId == null) {
      continue;
    }

    const popupRow = mapWorkOrderToSitePopupRow(workOrder, nowMs);
    const existing = workOrdersBySiteId.get(siteId) ?? [];
    existing.push(popupRow);
    workOrdersBySiteId.set(siteId, existing);
  }

  return [...workOrdersBySiteId.entries()]
    .map(([siteId, siteWorkOrders]) => {
      const site = siteById.get(siteId);
      if (
        site == null ||
        site.latitude == null ||
        site.longitude == null
      ) {
        return undefined;
      }

      return {
        siteId,
        name: site.name ?? siteId,
        city: site.city ?? "",
        latitude: site.latitude,
        longitude: site.longitude,
        workOrders: siteWorkOrders,
      };
    })
    .filter((site): site is MapSiteData => site != null);
}

/** Looks up site coordinates for a focused work order during map focus sync. */
export function getMapSiteForWorkOrder(
  sites: readonly MapSiteData[],
  workOrderId: string,
): MapSiteData | undefined {
  return sites.find((site) =>
    site.workOrders.some((workOrder) => workOrder.workOrderId === workOrderId),
  );
}
