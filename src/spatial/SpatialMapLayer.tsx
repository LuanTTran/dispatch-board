import { memo, useCallback } from "react";

import type { WorkOrderFocusSource } from "@/workspace/focusSource";
import { MapQueueFocusBridge } from "@/spatial/MapQueueFocusBridge";
import { MapViewportBridge } from "@/spatial/MapViewportBridge";
import { SiteMarker } from "@/spatial/SiteMarker";
import { TechnicianMarker } from "@/spatial/TechnicianMarker";
import type { MapSiteData, MapTechnicianData } from "@/spatial/types";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";

type SpatialMapLayerProps = {
  sites: MapSiteData[];
  technicians: MapTechnicianData[];
};

type MapSiteMarkersLayerProps = {
  sites: MapSiteData[];
  focusedWorkOrderId: string | null;
  focusSource: WorkOrderFocusSource | null;
  onSelectWorkOrder: (workOrderId: string) => void;
};

type MapTechnicianMarkersLayerProps = {
  technicians: MapTechnicianData[];
  compareTechnicianIds: string[];
};

const MapSiteMarkersLayer = memo(function MapSiteMarkersLayer({
  sites,
  focusedWorkOrderId,
  focusSource,
  onSelectWorkOrder,
}: MapSiteMarkersLayerProps): React.ReactElement {
  return (
    <>
      {sites.map((site) => {
        const isFocused =
          focusedWorkOrderId !== null &&
          site.workOrders.some(
            (workOrder) => workOrder.workOrderId === focusedWorkOrderId,
          );

        return (
          <SiteMarker
            key={site.siteId}
            site={site}
            isFocused={isFocused}
            focusedWorkOrderId={isFocused ? focusedWorkOrderId : null}
            interactionMode={
              isFocused && focusSource === "queue" ? "queue-focus" : "map-pick"
            }
            onSelectWorkOrder={onSelectWorkOrder}
          />
        );
      })}
    </>
  );
});

const MapTechnicianMarkersLayer = memo(function MapTechnicianMarkersLayer({
  technicians,
  compareTechnicianIds,
}: MapTechnicianMarkersLayerProps): React.ReactElement {
  return (
    <>
      {technicians.map((technician) => {
        const isCompareSelected = compareTechnicianIds.includes(
          technician.technicianId,
        );

        return (
          <TechnicianMarker
            key={technician.technicianId}
            technician={technician}
            isCompareSelected={isCompareSelected}
            zIndexOffset={isCompareSelected ? 200 : 50}
          />
        );
      })}
    </>
  );
});

/** Renders site and tech markers plus map focus sync from MapPanel OSDK data. */
export function SpatialMapLayer({
  sites,
  technicians,
}: SpatialMapLayerProps): React.ReactElement {
  const { focusedWorkOrderId, focusSource, setFocusedWorkOrderId, compareTechnicianIds } =
    useWorkspaceSelection();

  const handleSelectWorkOrderFromMap = useCallback(
    (workOrderId: string): void => {
      setFocusedWorkOrderId(workOrderId, { source: "map" });
    },
    [setFocusedWorkOrderId],
  );

  return (
    <>
      <MapViewportBridge />
      <MapQueueFocusBridge
        sites={sites}
        focusedWorkOrderId={focusedWorkOrderId}
        focusSource={focusSource}
      />
      <MapSiteMarkersLayer
        sites={sites}
        focusedWorkOrderId={focusedWorkOrderId}
        focusSource={focusSource}
        onSelectWorkOrder={handleSelectWorkOrderFromMap}
      />
      <MapTechnicianMarkersLayer
        technicians={technicians}
        compareTechnicianIds={compareTechnicianIds}
      />
    </>
  );
}
