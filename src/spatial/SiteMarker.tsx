import type { Marker, Popup as LeafletPopup } from "leaflet";
import { memo, useCallback, useMemo, useRef } from "react";
import { Marker as LeafletMarker, Popup } from "react-leaflet";

import {
  FOCUSED_SITE_MARKER_Z_INDEX_OFFSET,
  SITE_POPUP_AUTO_PAN_PADDING,
  SITE_POPUP_MAX_HEIGHT,
} from "@/constants/spatial";
import { useMountEffect } from "@/hooks/useMountEffect";
import { createSiteMarkerIcon } from "@/spatial/markerIcons";
import { SitePopupLayoutSync } from "@/spatial/SitePopupLayoutSync";
import { SiteWorkOrderPopup } from "@/spatial/SiteWorkOrderPopup";
import { siteMarkerRegistry } from "@/spatial/siteMarkerRegistry";
import {
  getPeakSiteUrgency,
  siteUrgencyZIndex,
} from "@/spatial/siteUrgencyStyle";
import type { MapSiteData } from "@/spatial/types";

type SiteMarkerInteractionMode = "queue-focus" | "map-pick";

type SiteMarkerProps = {
  site: MapSiteData;
  isFocused: boolean;
  focusedWorkOrderId: string | null;
  interactionMode: SiteMarkerInteractionMode;
  onSelectWorkOrder: (workOrderId: string) => void;
};

/** One pin per site colored by SLA urgency. Focused work order enlarges the pin and ring. */
export const SiteMarker = memo(function SiteMarker({
  site,
  isFocused,
  focusedWorkOrderId,
  interactionMode,
  onSelectWorkOrder,
}: SiteMarkerProps): React.ReactElement {
  const markerRef = useRef<Marker | null>(null);
  const popupRef = useRef<LeafletPopup | null>(null);
  const urgency = getPeakSiteUrgency(site.workOrders);
  const workOrderCount = site.workOrders.length;
  const icon = useMemo(
    () => createSiteMarkerIcon(urgency, isFocused, workOrderCount),
    [urgency, isFocused, workOrderCount],
  );

  const isMultiSite = workOrderCount > 1;

  const openPopup = useCallback((): void => {
    markerRef.current?.openPopup();
    requestAnimationFrame(() => {
      popupRef.current?.update();
    });
  }, []);

  useMountEffect(() => {
    return siteMarkerRegistry.register(site.siteId, { openPopup });
  });

  const setMarkerRef = useCallback(
    (marker: Marker | null): void => {
      markerRef.current = marker;
    },
    [],
  );

  const setPopupRef = useCallback(
    (popup: LeafletPopup | null): void => {
      popupRef.current = popup;
    },
    [],
  );

  return (
    <>
      <LeafletMarker
        ref={setMarkerRef}
        position={[site.latitude, site.longitude]}
        icon={icon}
        zIndexOffset={
          isFocused
            ? FOCUSED_SITE_MARKER_Z_INDEX_OFFSET
            : siteUrgencyZIndex[urgency]
        }
      >
        <Popup
          ref={setPopupRef}
          className="spatial-popup"
          minWidth={240}
          maxHeight={isMultiSite ? SITE_POPUP_MAX_HEIGHT : undefined}
          autoPan={interactionMode !== "queue-focus"}
          autoPanPadding={SITE_POPUP_AUTO_PAN_PADDING}
          keepInView={isMultiSite}
          eventHandlers={{
            popupopen: () => {
              requestAnimationFrame(() => {
                popupRef.current?.update();
              });
            },
          }}
        >
          <SiteWorkOrderPopup
            site={site}
            focusedWorkOrderId={focusedWorkOrderId}
            onSelectWorkOrder={onSelectWorkOrder}
            interactionMode={interactionMode}
          />
          <SitePopupLayoutSync popupRef={popupRef} />
        </Popup>
      </LeafletMarker>
    </>
  );
}, siteMarkerPropsAreEqual);

function siteMarkerPropsAreEqual(
  prev: SiteMarkerProps,
  next: SiteMarkerProps,
): boolean {
  if (prev.site !== next.site) {
    return false;
  }
  if (prev.isFocused !== next.isFocused) {
    return false;
  }
  if (prev.interactionMode !== next.interactionMode) {
    return false;
  }
  if (prev.onSelectWorkOrder !== next.onSelectWorkOrder) {
    return false;
  }
  if (prev.isFocused || next.isFocused) {
    return prev.focusedWorkOrderId === next.focusedWorkOrderId;
  }
  return true;
}
