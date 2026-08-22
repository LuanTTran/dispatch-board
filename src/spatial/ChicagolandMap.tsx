import "leaflet/dist/leaflet.css";

import { useTheme } from "next-themes";
import { MapContainer, TileLayer } from "react-leaflet";

import { cn } from "@/lib/utils";
import {
  CARTO_ATTRIBUTION,
  CHICAGOLAND_CENTER,
  CHICAGOLAND_DEFAULT_ZOOM,
  CHICAGOLAND_MAX_BOUNDS,
  CHICAGOLAND_MAX_ZOOM,
  CHICAGOLAND_MIN_ZOOM,
  getCartoBasemapTileUrl,
} from "@/spatial/chicagolandBounds";
import { HubMarker } from "@/spatial/HubMarker";
import { SpatialMapLayer } from "@/spatial/SpatialMapLayer";
import type { MapSiteData, MapTechnicianData } from "@/spatial/types";

type ChicagolandMapProps = {
  className?: string;
  sites: MapSiteData[];
  technicians: MapTechnicianData[];
};

/** Ambient Chicagoland basemap. Uses CARTO Positron in light mode and Dark Matter in dark mode. */
export function ChicagolandMap({
  className,
  sites,
  technicians,
}: ChicagolandMapProps): React.ReactElement {
  const { resolvedTheme } = useTheme();
  const basemapTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <MapContainer
      center={CHICAGOLAND_CENTER}
      zoom={CHICAGOLAND_DEFAULT_ZOOM}
      minZoom={CHICAGOLAND_MIN_ZOOM}
      maxZoom={CHICAGOLAND_MAX_ZOOM}
      maxBounds={CHICAGOLAND_MAX_BOUNDS}
      maxBoundsViscosity={1}
      className={cn("h-full w-full", className)}
      scrollWheelZoom
    >
      <TileLayer
        key={basemapTheme}
        attribution={CARTO_ATTRIBUTION}
        url={getCartoBasemapTileUrl(resolvedTheme)}
      />
      <HubMarker />
      <SpatialMapLayer sites={sites} technicians={technicians} />
    </MapContainer>
  );
}
