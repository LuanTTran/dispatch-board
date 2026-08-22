import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import { CHICAGO_HUB_COORDS } from "@/constants/spatial";
import { createHubMarkerIcon } from "@/spatial/markerIcons";

/** Chicago hub reference landmark. Context only, not an interactive assign target. */
export function HubMarker(): React.ReactElement {
  const icon = useMemo(() => createHubMarkerIcon(), []);

  return (
    <Marker
      position={[CHICAGO_HUB_COORDS.latitude, CHICAGO_HUB_COORDS.longitude]}
      icon={icon}
      zIndexOffset={-100}
    >
      <Popup className="spatial-popup" minWidth={160}>
        <div className="text-sm">
          <p className="font-medium text-foreground">{CHICAGO_HUB_COORDS.label}</p>
          <p className="text-muted-foreground">Central parts hub</p>
        </div>
      </Popup>
    </Marker>
  );
}
