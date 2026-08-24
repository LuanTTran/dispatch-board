import { useMemo } from "react";
import { useOsdkObjects } from "@osdk/react";
import { useFoundryUser } from "@osdk/react/platform-apis";
import { OsdkDispatchDecision } from "@dispatch-command-board/sdk";
import { ACTIVITY_FULL_LOG_PAGE_SIZE, type DispatchDecisionData } from "@/lenses/activity/types";
import { mapDispatchDecisions } from "@/utils/activity/mapDispatchDecision";
import { formatFoundryUserDisplayName } from "@/utils/foundry/formatFoundryUserDisplayName";
import {
  indexActorUsername,
  isFoundryUserUuid,
  normalizeFoundryUserId,
} from "@/utils/foundry/resolveFoundryActorLabel";
import { useFoundryCurrentUser } from "@/workspace/FoundryCurrentUserProvider";

const RECENT_DECISIONS_QUERY = {
  orderBy: { timestamp: "desc" } as const,
  pageSize: ACTIVITY_FULL_LOG_PAGE_SIZE,
};

type UseRecentDispatchDecisionsResult = {
  decisions: DispatchDecisionData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

function firstUuidActor(rows: readonly { actor?: string }[]): string {
  for (const row of rows) {
    if (row.actor == null) {
      continue;
    }
    const userId = normalizeFoundryUserId(row.actor);
    if (isFoundryUserUuid(userId)) {
      return userId;
    }
  }
  return "";
}

/** Newest dispatch decisions for the footer strip and full log. One page covers both. */
export function useRecentDispatchDecisions(): UseRecentDispatchDecisionsResult {
  const { displayNameByUserId } = useFoundryCurrentUser();
  const { data, isLoading, error, refetch } = useOsdkObjects(
    OsdkDispatchDecision,
    RECENT_DECISIONS_QUERY,
  );

  const actorUserId = firstUuidActor(data ?? []);
  const { user: actorUser } = useFoundryUser(actorUserId, { enabled: actorUserId.length > 0 });

  const usernameByUserId = useMemo(() => {
    if (actorUser == null) {
      return displayNameByUserId;
    }
    const names = new Map(displayNameByUserId);
    indexActorUsername(names, actorUser.id, formatFoundryUserDisplayName(actorUser));
    return names;
  }, [displayNameByUserId, actorUser]);

  const decisions = useMemo(
    () => mapDispatchDecisions(data ?? [], usernameByUserId),
    [data, usernameByUserId],
  );

  return {
    decisions,
    isLoading,
    error,
    refetch,
  };
}
