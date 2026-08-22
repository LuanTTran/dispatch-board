import type { Marker } from "leaflet";
import type { RefObject } from "react";
import { useMap } from "react-leaflet";

import { useMountEffect } from "@/hooks/useMountEffect";
import { MAP_FOCUS_FLY_TO_DURATION_MS } from "@/constants/spatial";

type SitePopupOpenSyncProps = {
  markerRef: RefObject<Marker | null>;
};

/** Opens the site popup after queue focus pan. Closes any open technician popup first. */
export function SitePopupOpenSync({
  markerRef,
}: SitePopupOpenSyncProps): null {
  const map = useMap();

  useMountEffect(() => {
    map.closePopup();

    const timer = window.setTimeout(() => {
      markerRef.current?.openPopup();
    }, MAP_FOCUS_FLY_TO_DURATION_MS + 50);

    return () => {
      window.clearTimeout(timer);
    };
  });

  return null;
}
