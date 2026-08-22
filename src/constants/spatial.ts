/** Page size for CustomerSite fetch. Seed has 18 rows with headroom for growth. */
export const CUSTOMER_SITES_PAGE_SIZE = 40;

/** Matches map focus animation duration so the popup opens after pan completes. */
export const MAP_FOCUS_FLY_TO_DURATION_MS = 750;

/** Pixels NE of co-located site dot so tech triangle does not cover urgency pin. */
export const TECH_MARKER_PIXEL_OFFSET = 9;

/** Focused site pin stacks above technician markers. */
export const FOCUSED_SITE_MARKER_Z_INDEX_OFFSET = 1000;

/** Page size for active assignments used to derive jobs-left on map and operations panels. */
export const DISPATCH_ASSIGNMENTS_PAGE_SIZE = 50;

/** Chicago central hub landmark pin. Reference only, not an assign target. */
export const CHICAGO_HUB_COORDS = {
  latitude: 41.8781,
  longitude: -87.6298,
  label: "Chicago Hub",
} as const;

/** Scroll cap for multi-job site popups so autopan can keep them in view at higher zoom. */
export const SITE_POPUP_MAX_HEIGHT = 240;

/** Viewport margin Leaflet uses when autopanning to fit a site popup. */
export const SITE_POPUP_AUTO_PAN_PADDING: [number, number] = [20, 20];
