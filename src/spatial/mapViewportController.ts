export type MapFocusTarget = {
  latitude: number;
  longitude: number;
  siteId: string;
};

type MapViewportController = {
  focusSite: ((target: MapFocusTarget) => void) | null;
};

/** Imperative bridge from queue selection into the Leaflet map instance. */
export const mapViewportController: MapViewportController = {
  focusSite: null,
};
