import type { Marker } from "leaflet";
import { useMemo, useRef } from "react";
import { Marker as LeafletMarker, Popup } from "react-leaflet";

import { FOCUSED_SITE_MARKER_Z_INDEX_OFFSET } from "@/constants/spatial";
import { createSiteMarkerIcon } from "@/spatial/markerIcons";
import { SitePopupOpenSync } from "@/spatial/SitePopupOpenSync";
import { SiteWorkOrderPopup } from "@/spatial/SiteWorkOrderPopup";
import { getPeakSiteUrgency } from "@/spatial/siteUrgencyStyle";
import type { MapSiteData } from "@/spatial/types";
import type { WorkOrderFocusSource } from "@/workspace/focusSource";

type SiteMarkerProps = {
  site: MapSiteData;
  focusedWorkOrderId: string | null;
  focusSource: WorkOrderFocusSource | null;
  onSelectWorkOrder: (workOrderId: string) => void;
};

/** One pin per site colored by SLA urgency. Focused work order enlarges the pin and ring. */
export function SiteMarker({
  site,
  focusedWorkOrderId,
  focusSource,
  onSelectWorkOrder,
}: SiteMarkerProps): React.ReactElement {
  const markerRef = useRef<Marker | null>(null);
  const isFocused = site.workOrders.some(
    (workOrder) => workOrder.workOrderId === focusedWorkOrderId,
  );
  const shouldAutoOpenPopup = isFocused && focusSource === "queue";
  const interactionMode =
    isFocused && focusSource === "queue" ? "queue-focus" : "map-pick";
  const urgency = getPeakSiteUrgency(site.workOrders);
  const icon = useMemo(
    () => createSiteMarkerIcon(urgency, isFocused),
    [urgency, isFocused],
  );

  return (
    <>
      <LeafletMarker
        ref={markerRef}
        position={[site.latitude, site.longitude]}
        icon={icon}
        zIndexOffset={isFocused ? FOCUSED_SITE_MARKER_Z_INDEX_OFFSET : 0}
      >
        <Popup className="spatial-popup" minWidth={240}>
          <SiteWorkOrderPopup
            site={site}
            focusedWorkOrderId={focusedWorkOrderId}
            onSelectWorkOrder={onSelectWorkOrder}
            interactionMode={interactionMode}
          />
        </Popup>
      </LeafletMarker>

      {shouldAutoOpenPopup && focusedWorkOrderId != null ? (
        <SitePopupOpenSync
          key={focusedWorkOrderId}
          markerRef={markerRef}
        />
      ) : null}
    </>
  );
}
