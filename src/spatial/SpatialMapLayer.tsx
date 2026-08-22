import { useMemo } from "react";

import { MapFocusSync } from "@/spatial/MapFocusSync";
import { SiteMarker } from "@/spatial/SiteMarker";
import { TechnicianMarker } from "@/spatial/TechnicianMarker";
import type { MapSiteData, MapTechnicianData } from "@/spatial/types";
import { getMapSiteForWorkOrder } from "@/utils/spatial/mapMapSite";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";

type SpatialMapLayerProps = {
  sites: MapSiteData[];
  technicians: MapTechnicianData[];
};

/** Renders site and tech markers plus map focus sync from MapPanel OSDK data. */
export function SpatialMapLayer({
  sites,
  technicians,
}: SpatialMapLayerProps): React.ReactElement {
  const { focusedWorkOrderId, focusSource, setFocusedWorkOrderId, compareTechnicianIds } =
    useWorkspaceSelection();

  const handleSelectWorkOrderFromMap = (workOrderId: string): void => {
    setFocusedWorkOrderId(workOrderId, { source: "map" });
  };

  const focusedSite = useMemo(
    () =>
      focusedWorkOrderId !== null
        ? getMapSiteForWorkOrder(sites, focusedWorkOrderId)
        : undefined,
    [focusedWorkOrderId, sites],
  );

  return (
    <>
      {sites.map((site) => (
        <SiteMarker
          key={site.siteId}
          site={site}
          focusedWorkOrderId={focusedWorkOrderId}
          focusSource={focusSource}
          onSelectWorkOrder={handleSelectWorkOrderFromMap}
        />
      ))}

      {technicians.map((technician) => (
        <TechnicianMarker
          key={technician.technicianId}
          technician={technician}
          isCompareSelected={compareTechnicianIds.includes(technician.technicianId)}
          zIndexOffset={compareTechnicianIds.includes(technician.technicianId) ? 200 : 50}
        />
      ))}

      {focusedSite !== undefined ? (
        <MapFocusSync
          key={focusedWorkOrderId ?? "none"}
          latitude={focusedSite.latitude}
          longitude={focusedSite.longitude}
        />
      ) : null}
    </>
  );
}
