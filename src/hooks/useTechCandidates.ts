import { useMemo } from "react";

import type { TechCandidateData } from "@/dispatch/types";
import { useTechnicianPoolData } from "@/hooks/useTechnicianPool";
import { mapTechCandidates } from "@/utils/operations/mapTechCandidate";

type UseTechCandidatesResult = {
  candidates: TechCandidateData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Candidate checkbox rows from the shared Chicago-hub technician pool. */
export function useTechCandidates(): UseTechCandidatesResult {
  const { technicians, countsByTechnicianId, isLoading, error, refetch } =
    useTechnicianPoolData();

  const candidates = useMemo(
    () => mapTechCandidates(technicians, countsByTechnicianId),
    [technicians, countsByTechnicianId],
  );

  return {
    candidates,
    isLoading,
    error,
    refetch,
  };
}
