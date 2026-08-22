import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFullLogDialog } from "@/lenses/activity/ActivityFullLogDialog";
import { RecentDispatchesStrip } from "@/lenses/activity/RecentDispatchesStrip";
import {
  ACTIVITY_FULL_LOG_PAGE_SIZE,
  RECENT_DECISIONS_LIMIT,
} from "@/lenses/activity/types";
import { useRecentDispatchDecisions } from "@/hooks/useRecentDispatchDecisions";

/** Recent dispatch strip below the three-column grid. */
export function ActivityFooter(): React.ReactElement {
  const [fullLogOpen, setFullLogOpen] = useState(false);

  const {
    decisions: recentDecisions,
    isLoading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useRecentDispatchDecisions(RECENT_DECISIONS_LIMIT);

  const { decisions: allDecisions, isLoading: fullLogLoading } =
    useRecentDispatchDecisions(ACTIVITY_FULL_LOG_PAGE_SIZE);

  return (
    <>
      <footer className="shrink-0 border-t border-border pt-2">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="shrink-0 font-medium text-muted-foreground">Recent</span>
          {recentError != null ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-balance">
                  {recentError.message}
                </AlertDescription>
              </Alert>
              <Button type="button" variant="outline" size="sm" onClick={() => refetchRecent()}>
                Retry
              </Button>
            </div>
          ) : recentLoading ? (
            <Skeleton className="h-5 min-w-0 flex-1" />
          ) : (
            <RecentDispatchesStrip decisions={recentDecisions} />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={fullLogLoading}
            onClick={() => setFullLogOpen(true)}
          >
            Full log
          </Button>
        </div>
      </footer>

      <ActivityFullLogDialog
        open={fullLogOpen}
        onOpenChange={setFullLogOpen}
        decisions={allDecisions}
      />
    </>
  );
}
