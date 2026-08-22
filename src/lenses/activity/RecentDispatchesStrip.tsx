import { ActivityDecisionLine } from "@/lenses/activity/ActivityDecisionLine";
import type { DispatchDecisionData } from "@/lenses/activity/types";

type RecentDispatchesStripProps = {
  decisions: DispatchDecisionData[];
};

/** Footer ticker where chips scroll as a row with fixed text inside each chip. */
export function RecentDispatchesStrip({
  decisions,
}: RecentDispatchesStripProps): React.ReactElement {
  if (decisions.length === 0) {
    return (
      <span className="truncate text-muted-foreground">No recent dispatch decisions</span>
    );
  }

  return (
    <div className="min-w-0 flex-1 overflow-hidden pb-0.5 motion-reduce:overflow-x-auto">
      <div className="activity-marquee-track flex w-max items-center gap-2">
        {decisions.map((decision) => (
          <ActivityDecisionLine key={decision.decisionId} decision={decision} variant="strip" />
        ))}
        {decisions.map((decision) => (
          <ActivityDecisionLine
            key={`marquee-dup-${decision.decisionId}`}
            decision={decision}
            variant="strip"
            ariaHidden
          />
        ))}
      </div>
    </div>
  );
}
