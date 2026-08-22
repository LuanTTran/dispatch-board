import { _osdkTechnician } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import {
  TECH_CANDIDATES_FILTER,
  TECH_CANDIDATES_PAGE_SIZE,
} from "@/constants/dispatch";
import { useTechnicianAssignmentCounts } from "@/hooks/useTechnicianAssignmentCounts";
import type { MapTechnicianData } from "@/spatial/types";
import { mapMapTechnicians } from "@/utils/spatial/mapMapTechnician";

type UseMapTechniciansResult = {
  technicians: MapTechnicianData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Tech pins use the same Chicago-hub pool as compare plus jobs-left from assignments. */
export function useMapTechnicians(): UseMapTechniciansResult {
  const {
    data: technicians,
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

  const mapTechnicians = useMemo(
    () => mapMapTechnicians(technicians ?? [], countsByTechnicianId),
    [technicians, countsByTechnicianId],
  );

  const refetch = (): void => {
    refetchTechnicians();
    refetchAssignments();
  };

  return {
    technicians: mapTechnicians,
    isLoading: techniciansLoading || assignmentsLoading,
    error: techniciansError ?? assignmentsError,
    refetch,
  };
}
