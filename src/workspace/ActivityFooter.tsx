import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasLoadedOnce } from "@/hooks/useHasLoadedOnce";
import { useRecentDispatchDecisions } from "@/hooks/useRecentDispatchDecisions";
import { ActivityFullLogDialog } from "@/lenses/activity/ActivityFullLogDialog";
import { RecentDispatchesStrip } from "@/lenses/activity/RecentDispatchesStrip";
import { RECENT_DECISIONS_LIMIT } from "@/lenses/activity/types";

/** Recent dispatch strip below the three-column grid. */
export function ActivityFooter(): React.ReactElement {
  const [fullLogOpen, setFullLogOpen] = useState(false);

  const { decisions, isLoading, error, refetch } = useRecentDispatchDecisions();
  const hasLoadedOnce = useHasLoadedOnce(isLoading);

  const recentDecisions = useMemo(() => decisions.slice(0, RECENT_DECISIONS_LIMIT), [decisions]);

  return (
    <>
      <footer className="shrink-0 border-t border-border pt-2">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="shrink-0 font-medium text-muted-foreground">Recent</span>
          {error != null ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-balance">{error.message}</AlertDescription>
              </Alert>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : isLoading && !hasLoadedOnce ? (
            <Skeleton className="h-5 min-w-0 flex-1" />
          ) : (
            <RecentDispatchesStrip decisions={recentDecisions} />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={isLoading && !hasLoadedOnce}
            onClick={() => setFullLogOpen(true)}
          >
            Full log
          </Button>
        </div>
      </footer>

      <ActivityFullLogDialog
        open={fullLogOpen}
        onOpenChange={setFullLogOpen}
        decisions={decisions}
      />
    </>
  );
}
