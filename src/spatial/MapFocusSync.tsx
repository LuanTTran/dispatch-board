import { useMap } from "react-leaflet";

import { MAP_FOCUS_FLY_TO_DURATION_MS } from "@/constants/spatial";
import { useMountEffect } from "@/hooks/useMountEffect";
import { CHICAGOLAND_DEFAULT_ZOOM } from "@/spatial/chicagolandBounds";

type MapFocusSyncProps = {
  latitude: number;
  longitude: number;
};

/** Pans the map to the focused work order site. Remount via key={focusedWorkOrderId} in parent. */
export function MapFocusSync({
  latitude,
  longitude,
}: MapFocusSyncProps): null {
  const map = useMap();

  useMountEffect(() => {
    map.flyTo([latitude, longitude], CHICAGOLAND_DEFAULT_ZOOM + 2, {
      duration: MAP_FOCUS_FLY_TO_DURATION_MS / 1000,
    });
  });

  return null;
}
