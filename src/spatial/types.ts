import type { QueueUrgency } from "@/lenses/queue/types";

/** One open urgent work order rendered on a site pin popup. */
export type MapSiteWorkOrder = {
  workOrderId: string;
  slaLabel: string;
  symptomOneLiner: string;
  urgency: QueueUrgency;
};

/** Site pin with lat/lng from CustomerSite. Work orders grouped client-side. */
export type MapSiteData = {
  siteId: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  workOrders: MapSiteWorkOrder[];
};

/** Technician pin with last-known position and popup copy. */
export type MapTechnicianData = {
  technicianId: string;
  name: string;
  latitude: number;
  longitude: number;
  skillsLabel: string;
  jobsLeftLabel: string;
  locationLabel: string;
  locationStale: boolean;
};
