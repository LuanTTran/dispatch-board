import { useMap } from "react-leaflet";

import { useMountEffect } from "@/hooks/useMountEffect";
import { registerMapViewportFocus } from "@/spatial/mapViewportFocus";

/** Registers map focus on the Leaflet map instance once. */
export function MapViewportBridge(): null {
  const map = useMap();

  useMountEffect(() => registerMapViewportFocus(map));

  return null;
}
