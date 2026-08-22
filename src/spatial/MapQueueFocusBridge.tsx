import { useRef } from "react";

import { mapViewportController } from "@/spatial/mapViewportController";
import type { MapSiteData } from "@/spatial/types";
import { getMapSiteForWorkOrder } from "@/utils/spatial/mapMapSite";
import type { WorkOrderFocusSource } from "@/workspace/focusSource";

type MapQueueFocusBridgeProps = {
  sites: MapSiteData[];
  focusedWorkOrderId: string | null;
  focusSource: WorkOrderFocusSource | null;
};

/**
 * Pans to the queue-selected site using map-local site data.
 * Runs after SpatialMapLayer render so coords and marker refs are ready.
 */
export function MapQueueFocusBridge({
  sites,
  focusedWorkOrderId,
  focusSource,
}: MapQueueFocusBridgeProps): null {
  const lastFocusedRef = useRef<string | null>(null);

  if (focusSource === "queue" && focusedWorkOrderId != null) {
    const site = getMapSiteForWorkOrder(sites, focusedWorkOrderId);
    if (
      site != null &&
      lastFocusedRef.current !== focusedWorkOrderId
    ) {
      lastFocusedRef.current = focusedWorkOrderId;
      queueMicrotask(() => {
        mapViewportController.focusSite?.({
          latitude: site.latitude,
          longitude: site.longitude,
          siteId: site.siteId,
        });
      });
    }
  } else if (focusSource !== "queue") {
    lastFocusedRef.current = null;
  }

  return null;
}
