import L from "leaflet";

import { TECH_MARKER_PIXEL_OFFSET } from "@/constants/spatial";
import type { QueueUrgency } from "@/lenses/queue/types";
import { siteUrgencyPinClass } from "@/spatial/siteUrgencyStyle";

/** Leaflet DivIcon for a site pin circle with optional focus ring and job count. */
export function createSiteMarkerIcon(
  urgency: QueueUrgency,
  isFocused: boolean,
  workOrderCount: number,
): L.DivIcon {
  const urgencyClass = siteUrgencyPinClass[urgency];
  const size = isFocused ? 24 : 18;
  const ringClass = isFocused ? "site-marker-pin--focused" : "";
  const countBadge =
    workOrderCount > 1
      ? `<span class="site-marker-count">${workOrderCount}</span>`
      : "";

  return L.divIcon({
    className: "site-marker-icon",
    html: `<div class="site-marker-pin ${urgencyClass} ${ringClass}" aria-hidden="true">${countBadge}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Leaflet DivIcon for a small warehouse landmark at the Chicago hub. */
export function createHubMarkerIcon(): L.DivIcon {
  const size = 12;

  return L.divIcon({
    className: "hub-marker-icon",
    html: `<div class="hub-marker-pin" aria-hidden="true"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Leaflet DivIcon for a triangle tech pin with optional compare ring. */
export function createTechnicianMarkerIcon(isCompareSelected: boolean): L.DivIcon {
  const size = isCompareSelected ? 26 : 22;
  const ringClass = isCompareSelected ? "tech-marker-pin--compare" : "";
  const anchorX = size / 2 - TECH_MARKER_PIXEL_OFFSET;
  const anchorY = size / 2 + TECH_MARKER_PIXEL_OFFSET + 2;

  return L.divIcon({
    className: "tech-marker-icon",
    html: `<div class="tech-marker-pin ${ringClass}" aria-hidden="true"><span class="tech-marker-triangle"></span></div>`,
    iconSize: [size, size],
    iconAnchor: [anchorX, anchorY],
  });
}
