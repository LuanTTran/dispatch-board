/** Parts path signal mapped to green, yellow, or red in the UI. Classified in utils. */
export type PartsPathStatus = "green" | "yellow" | "red";

export const MAX_COMPARE_TECHNICIANS = 2;

/** View model for one compare column. Mapped from Technician and inventory in useTechCompare. */
export type CompareTechData = {
  technicianId: string;
  label: string;
  skillsLabel: string;
  jobsLeftLabel: string;
  partsPath: {
    status: PartsPathStatus;
    statusLabel: string;
    sourceLabel: string;
    skuId: string;
    quantity: number;
    asOfLabel: string;
    /** Optional detail line for hub-only paths, for example "Truck 0 · 3h". */
    supplementLabel?: string;
  };
  locationLabel: string;
  locationStale?: boolean;
  /** Truck row asOf exceeds the staleness threshold and drives confirm stale acknowledgment. */
  truckInventoryStale?: boolean;
};
