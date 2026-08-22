import { DECISION_TYPE_META } from "@/lenses/activity/decisionTypeMeta";
import {
  formatActivityDecisionHeadline,
  formatActivityDecisionLine,
  formatActivityTime,
} from "@/lenses/activity/formatActivityDecisionLine";
import type { DispatchDecisionData } from "@/lenses/activity/types";
import { cn } from "@/lib/utils";

type ActivityDecisionLineProps = {
  decision: DispatchDecisionData;
  /** strip renders a compact chip in the footer ticker. log renders a static row in the full-log modal. */
  variant?: "strip" | "log";
  /** Duplicate chip in the marquee loop. Hidden from assistive technology. */
  ariaHidden?: boolean;
};

/** One formatted audit row as a thin chip in the footer or a full row in the log modal. */
export function ActivityDecisionLine({
  decision,
  variant = "strip",
  ariaHidden = false,
}: ActivityDecisionLineProps): React.ReactElement {
  const line = formatActivityDecisionLine(decision);

  if (variant === "log") {
    const typeMeta = DECISION_TYPE_META[decision.decisionType];

    return (
      <article className="rounded-lg border border-border bg-muted/20 px-3 py-3">
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              typeMeta.badgeClassName,
            )}
          >
            {typeMeta.label}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {formatActivityDecisionHeadline(decision)}
              </p>
              <time
                dateTime={decision.timestamp}
                className="shrink-0 text-xs tabular-nums text-muted-foreground"
              >
                {formatActivityTime(decision.timestamp)}
              </time>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border border-border bg-muted/30",
        "px-3 py-1.5 text-sm text-foreground",
      )}
    >
      {line}
    </article>
  );
}
