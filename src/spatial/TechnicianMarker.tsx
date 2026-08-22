import { memo, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import { createTechnicianMarkerIcon } from "@/spatial/markerIcons";
import { TechnicianPinPopup } from "@/spatial/TechnicianPinPopup";
import type { MapTechnicianData } from "@/spatial/types";

type TechnicianMarkerProps = {
  technician: MapTechnicianData;
  isCompareSelected: boolean;
  zIndexOffset?: number;
};

/** Last-known technician position. Compare selection adds a secondary highlight ring. */
export const TechnicianMarker = memo(function TechnicianMarker({
  technician,
  isCompareSelected,
  zIndexOffset = 50,
}: TechnicianMarkerProps): React.ReactElement {
  const icon = useMemo(
    () => createTechnicianMarkerIcon(isCompareSelected),
    [isCompareSelected],
  );

  return (
    <Marker
      position={[technician.latitude, technician.longitude]}
      icon={icon}
      zIndexOffset={zIndexOffset}
    >
      <Popup className="spatial-popup" minWidth={200}>
        <TechnicianPinPopup technician={technician} />
      </Popup>
    </Marker>
  );
});
