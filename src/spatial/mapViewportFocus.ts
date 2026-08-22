import L from "leaflet";

import { MAP_FOCUS_FLY_TO_DURATION_MS } from "@/constants/spatial";
import { CHICAGOLAND_DEFAULT_ZOOM } from "@/spatial/chicagolandBounds";
import {
  mapViewportController,
  type MapFocusTarget,
} from "@/spatial/mapViewportController";
import { siteMarkerRegistry } from "@/spatial/siteMarkerRegistry";

const FOCUS_ZOOM = CHICAGOLAND_DEFAULT_ZOOM + 2;
const FOCUS_ANIMATION_SECONDS = MAP_FOCUS_FLY_TO_DURATION_MS / 1000;
/** Skip animation when the target is already centered within ~150 m. */
const FOCUS_CENTER_TOLERANCE_METERS = 150;
const POPUP_OPEN_RETRY_MS = 50;
const POPUP_OPEN_MAX_ATTEMPTS = 10;

let activeFocusId = 0;
let activeCleanup: (() => void) | null = null;

function openFocusedPopup(siteId: string, focusId: number): void {
  if (focusId !== activeFocusId) {
    return;
  }

  const tryOpen = (attempt: number): void => {
    if (focusId !== activeFocusId) {
      return;
    }
    const opened = siteMarkerRegistry.openPopup(siteId);
    if (!opened && attempt < POPUP_OPEN_MAX_ATTEMPTS) {
      window.setTimeout(() => tryOpen(attempt + 1), POPUP_OPEN_RETRY_MS);
    }
  };

  requestAnimationFrame(() => tryOpen(0));
}

function focusMapOnSite(map: L.Map, target: MapFocusTarget): void {
  activeCleanup?.();
  activeCleanup = null;

  const focusId = ++activeFocusId;
  const latLng = L.latLng(target.latitude, target.longitude);

  map.stop();
  map.closePopup();

  const alreadyFramed =
    map.getZoom() === FOCUS_ZOOM &&
    map.getCenter().distanceTo(latLng) <= FOCUS_CENTER_TOLERANCE_METERS;

  if (alreadyFramed) {
    openFocusedPopup(target.siteId, focusId);
    return;
  }

  let completed = false;

  const complete = (): void => {
    if (completed || focusId !== activeFocusId) {
      return;
    }
    completed = true;
    map.off("moveend", onMoveEnd);
    window.clearTimeout(fallbackTimer);
    activeCleanup = null;
    openFocusedPopup(target.siteId, focusId);
  };

  const onMoveEnd = (): void => {
    complete();
  };

  const fallbackTimer = window.setTimeout(
    complete,
    MAP_FOCUS_FLY_TO_DURATION_MS + 150,
  );

  activeCleanup = (): void => {
    map.off("moveend", onMoveEnd);
    window.clearTimeout(fallbackTimer);
  };

  map.once("moveend", onMoveEnd);

  if (map.getZoom() === FOCUS_ZOOM) {
    map.panTo(latLng, {
      animate: true,
      duration: FOCUS_ANIMATION_SECONDS,
    });
    return;
  }

  map.flyTo(latLng, FOCUS_ZOOM, {
    duration: FOCUS_ANIMATION_SECONDS,
  });
}

/** Registers imperative map focus on the Leaflet instance once. */
export function registerMapViewportFocus(map: L.Map): () => void {
  mapViewportController.focusSite = (target) => {
    focusMapOnSite(map, target);
  };

  return () => {
    activeCleanup?.();
    activeCleanup = null;
    activeFocusId += 1;
    mapViewportController.focusSite = null;
  };
}

export { FOCUS_ZOOM };
