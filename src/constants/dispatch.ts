/** Chicago central hub ID. Matches seed-data homeHub and hubId. */
export const CHICAGO_HUB_ID = "HUB-CHI";

/** Central-region technicians homed at the Chicago hub. */
export const TECH_CANDIDATES_FILTER = {
  homeHub: CHICAGO_HUB_ID,
} as const;

export const TECH_CANDIDATES_PAGE_SIZE = 20;

/** Max age before truck or hub inventory is treated as stale. Default is 2 hours. */
export const INVENTORY_STALENESS_THRESHOLD_MS = 2 * 60 * 60 * 1000;
