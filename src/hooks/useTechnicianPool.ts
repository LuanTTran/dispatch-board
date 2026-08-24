import { _osdkTechnician } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { createContext, useCallback, useContext } from "react";

import {
  TECH_CANDIDATES_FILTER,
  TECH_CANDIDATES_PAGE_SIZE,
} from "@/constants/dispatch";
import { useTechnicianAssignmentCounts } from "@/hooks/useTechnicianAssignmentCounts";

const TECH_POOL_QUERY = {
  where: { ...TECH_CANDIDATES_FILTER },
  orderBy: { technicianId: "asc" } as const,
  pageSize: TECH_CANDIDATES_PAGE_SIZE,
};

const EMPTY_TECHNICIANS: _osdkTechnician.OsdkInstance[] = [];

export type UseTechnicianPoolResult = {
  technicians: _osdkTechnician.OsdkInstance[];
  countsByTechnicianId: ReadonlyMap<string, number>;
  confirmedTodayTechnicianIds: ReadonlySet<string>;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

export const TechnicianPoolContext = createContext<UseTechnicianPoolResult | null>(
  null,
);

/** Chicago-hub technician rows plus today's assignment counts. */
export function useTechnicianPool(): UseTechnicianPoolResult {
  const {
    data,
    isLoading: techniciansLoading,
    error: techniciansError,
    refetch: refetchTechnicians,
  } = useOsdkObjects(_osdkTechnician, TECH_POOL_QUERY);

  const {
    countsByTechnicianId,
    confirmedTodayTechnicianIds,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useTechnicianAssignmentCounts();

  const refetch = useCallback((): void => {
    refetchTechnicians();
    refetchAssignments();
  }, [refetchTechnicians, refetchAssignments]);

  return {
    technicians: data ?? EMPTY_TECHNICIANS,
    countsByTechnicianId,
    confirmedTodayTechnicianIds,
    isLoading: techniciansLoading || assignmentsLoading,
    error: techniciansError ?? assignmentsError,
    refetch,
  };
}

export function useTechnicianPoolData(): UseTechnicianPoolResult {
  const context = useContext(TechnicianPoolContext);
  if (context === null) {
    throw new Error(
      "useTechnicianPoolData must be used within TechnicianPoolProvider",
    );
  }
  return context;
}
