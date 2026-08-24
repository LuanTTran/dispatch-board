import { OsdkDispatchAssignment } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import { DISPATCH_ASSIGNMENTS_PAGE_SIZE } from "@/constants/spatial";
import {
  confirmedAssignmentTodayByTechnician,
  countActiveAssignmentsTodayByTechnician,
} from "@/utils/dispatch/jobsLeftPresentation";

type UseTechnicianAssignmentCountsResult = {
  countsByTechnicianId: ReadonlyMap<string, number>;
  confirmedTodayTechnicianIds: ReadonlySet<string>;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Today's active assignment counts. Shared via useTechnicianPool. */
export function useTechnicianAssignmentCounts(): UseTechnicianAssignmentCountsResult {
  const { data, isLoading, error, refetch } = useOsdkObjects(
    OsdkDispatchAssignment,
    {
      pageSize: DISPATCH_ASSIGNMENTS_PAGE_SIZE,
    },
  );

  const countsByTechnicianId = useMemo(
    () => countActiveAssignmentsTodayByTechnician(data ?? []),
    [data],
  );

  const confirmedTodayTechnicianIds = useMemo(
    () => confirmedAssignmentTodayByTechnician(data ?? []),
    [data],
  );

  return {
    countsByTechnicianId,
    confirmedTodayTechnicianIds,
    isLoading,
    error,
    refetch,
  };
}
