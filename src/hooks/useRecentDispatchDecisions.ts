import { OsdkDispatchDecision } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";
import { useMemo } from "react";

import type { DispatchDecisionData } from "@/lenses/activity/types";
import { mapDispatchDecisions } from "@/utils/activity/mapDispatchDecision";

type UseRecentDispatchDecisionsResult = {
  decisions: DispatchDecisionData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Recent audit feed of newest dispatch decisions for the footer strip and full log. */
export function useRecentDispatchDecisions(
  limit: number,
): UseRecentDispatchDecisionsResult {
  const { data, isLoading, error, refetch } = useOsdkObjects(
    OsdkDispatchDecision,
    {
      orderBy: { timestamp: "desc" },
      pageSize: limit,
    },
  );

  const decisions = useMemo(
    () => mapDispatchDecisions(data ?? []),
    [data],
  );

  return {
    decisions,
    isLoading,
    error,
    refetch,
  };
}
