import type { _osdkTechnician } from "@dispatch-command-board/sdk";

import type { MapTechnicianData } from "@/spatial/types";
import { formatSkillsLabel } from "@/utils/dispatch/formatSkillsLabel";
import { formatJobsLeftLabel } from "@/utils/dispatch/jobsLeftPresentation";
import { formatAgeLabel } from "@/utils/staleness/formatAgeLabel";
import { isLocationStale } from "@/utils/staleness/isLocationStale";

type TechnicianInstance = _osdkTechnician.OsdkInstance;

/** Maps an OSDK Technician to a map pin. Skips rows without last-known coordinates. */
export function mapMapTechnician(
  technician: TechnicianInstance,
  assignmentsToday: number,
  nowMs: number = Date.now(),
): MapTechnicianData | null {
  if (
    technician.lastKnownLatitude == null ||
    technician.lastKnownLongitude == null
  ) {
    return null;
  }

  return {
    technicianId: technician.technicianId,
    name: technician.name ?? technician.technicianId,
    latitude: technician.lastKnownLatitude,
    longitude: technician.lastKnownLongitude,
    skillsLabel: formatSkillsLabel(technician.skillTags),
    jobsLeftLabel: formatJobsLeftLabel(
      technician.maxDailyJobs,
      assignmentsToday,
    ),
    locationLabel: formatAgeLabel(technician.locationAsOfTimestamp),
    locationStale: isLocationStale(technician.locationAsOfTimestamp, nowMs),
  };
}

export function mapMapTechnicians(
  technicians: readonly TechnicianInstance[],
  assignmentsTodayByTechnicianId: ReadonlyMap<string, number>,
  nowMs: number = Date.now(),
): MapTechnicianData[] {
  return technicians
    .map((technician) =>
      mapMapTechnician(
        technician,
        assignmentsTodayByTechnicianId.get(technician.technicianId) ?? 0,
        nowMs,
      ),
    )
    .filter((technician): technician is MapTechnicianData => technician != null);
}
