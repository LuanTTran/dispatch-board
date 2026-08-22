import { _osdkTechnician } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import {
  TECH_CANDIDATES_FILTER,
  TECH_CANDIDATES_PAGE_SIZE,
} from "@/constants/dispatch";
import type { TechCandidateData } from "@/dispatch/types";
import { useTechnicianAssignmentCounts } from "@/hooks/useTechnicianAssignmentCounts";
import { mapTechCandidates } from "@/utils/operations/mapTechCandidate";

type UseTechCandidatesResult = {
  candidates: TechCandidateData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Central-region technician pool filtered by Chicago home hub. */
export function useTechCandidates(): UseTechCandidatesResult {
  const {
    data,
    isLoading: techniciansLoading,
    error: techniciansError,
    refetch: refetchTechnicians,
  } = useOsdkObjects(_osdkTechnician, {
    where: { ...TECH_CANDIDATES_FILTER },
    orderBy: { technicianId: "asc" },
    pageSize: TECH_CANDIDATES_PAGE_SIZE,
  });

  const {
    countsByTechnicianId,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useTechnicianAssignmentCounts();

  const candidates = useMemo(
    () => mapTechCandidates(data ?? [], countsByTechnicianId),
    [data, countsByTechnicianId],
  );

  const refetch = (): void => {
    refetchTechnicians();
    refetchAssignments();
  };

  return {
    candidates,
    isLoading: techniciansLoading || assignmentsLoading,
    error: techniciansError ?? assignmentsError,
    refetch,
  };
}
