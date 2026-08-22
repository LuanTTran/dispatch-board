import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

/** Bounding box from customer_sites.csv and technicians.csv latitude and longitude extrema. */
const SEED_LAT_MIN = 41.7508;
const SEED_LAT_MAX = 42.0565;
const SEED_LNG_MIN = -88.1535;
const SEED_LNG_MAX = -87.619;

const LAT_PADDING = (SEED_LAT_MAX - SEED_LAT_MIN) * 0.1;
const LNG_PADDING = (SEED_LNG_MAX - SEED_LNG_MIN) * 0.1;

/** Default map center, centroid of seed points, slightly north of the Loop. */
export const CHICAGOLAND_CENTER: LatLngExpression = [
  (SEED_LAT_MIN + SEED_LAT_MAX) / 2,
  (SEED_LNG_MIN + SEED_LNG_MAX) / 2,
];

/** Central region focused. */
export const CHICAGOLAND_MIN_ZOOM = 9;
export const CHICAGOLAND_MAX_ZOOM = 14;
export const CHICAGOLAND_DEFAULT_ZOOM = 10;

/** Pan limit, ~10% padding beyond seed envelope so edge pins stay in view later. */
export const CHICAGOLAND_MAX_BOUNDS: LatLngBoundsExpression = [
  [SEED_LAT_MIN - LAT_PADDING, SEED_LNG_MIN - LNG_PADDING],
  [SEED_LAT_MAX + LAT_PADDING, SEED_LNG_MAX + LNG_PADDING],
];

/** CARTO Positron, light basemap. */
export const CARTO_POSITRON_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

/** CARTO Dark Matter, dark basemap paired with Positron. */
export const CARTO_DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function getCartoBasemapTileUrl(
  resolvedTheme: string | undefined,
): string {
  return resolvedTheme === "dark"
    ? CARTO_DARK_TILE_URL
    : CARTO_POSITRON_TILE_URL;
}
