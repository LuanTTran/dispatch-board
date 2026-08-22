import type { _osdkTechnician } from "@dispatch-command-board/sdk";

import type { TechCandidateData } from "@/dispatch/types";
import { formatJobsLeftLabel } from "@/utils/dispatch/jobsLeftPresentation";

type TechnicianInstance = _osdkTechnician.OsdkInstance;

/** Maps OSDK Technician to a checkbox row in the candidate list. */
export function mapTechCandidate(
  technician: TechnicianInstance,
  assignmentsToday: number,
): TechCandidateData {
  return {
    technicianId: technician.technicianId,
    label: technician.name ?? technician.technicianId,
    jobsLeftLabel: formatJobsLeftLabel(
      technician.maxDailyJobs,
      assignmentsToday,
    ),
  };
}

export function mapTechCandidates(
  technicians: readonly TechnicianInstance[],
  assignmentsTodayByTechnicianId: ReadonlyMap<string, number>,
): TechCandidateData[] {
  return technicians.map((technician) =>
    mapTechCandidate(
      technician,
      assignmentsTodayByTechnicianId.get(technician.technicianId) ?? 0,
    ),
  );
}
