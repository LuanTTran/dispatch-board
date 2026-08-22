import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { JobDetailsData } from "@/lenses/operations/types";

type JobDetailsExpanderProps = {
  details: JobDetailsData;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

type DetailCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function DetailCard({ title, children, className }: DetailCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 p-3",
        className,
      )}
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

/** Collapsed investigative context with ontology links rendered as read-only cards. */
export function JobDetailsExpander({
  details,
  expanded,
  onExpandedChange,
}: JobDetailsExpanderProps): React.ReactElement {
  return (
    <Collapsible open={expanded} onOpenChange={onExpandedChange}>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md py-1 text-left text-sm font-medium text-foreground hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90",
          )}
        />
        Job details
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailCard title="Site">
              <p>{details.site.name}</p>
              <p className="text-muted-foreground">
                {details.site.city}, {details.site.zip}
              </p>
            </DetailCard>
            <DetailCard title="Equipment">
              <p>{details.equipment.model}</p>
              <p className="text-muted-foreground">{details.equipment.serialNumber}</p>
              <p className="text-muted-foreground">{details.equipment.category}</p>
            </DetailCard>
          </div>

          <DetailCard title="Predictions">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {details.predictions.map((prediction) => (
                <span key={prediction.rank} className="tabular-nums">
                  #{prediction.rank} {prediction.skuId} · conf {prediction.confidence.toFixed(2)}
                </span>
              ))}
            </div>
          </DetailCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailCard title="Hub stock (top SKU)">
              <p>
                {details.hubStock.skuId} · qty {details.hubStock.quantity}
              </p>
              <p className="text-muted-foreground">
                asOf {details.hubStock.asOfLabel} · {details.hubStock.stalenessLabel}
              </p>
            </DetailCard>
            <DetailCard title="Prior decisions (this WO)">
              {details.priorDecisions.length === 0 ? (
                <p className="text-muted-foreground">None</p>
              ) : (
                details.priorDecisions.map((decision) => (
                  <p key={`${decision.timestampLabel}-${decision.actor}`}>
                    {decision.timestampLabel} · {decision.actor} · {decision.summary}
                  </p>
                ))
              )}
            </DetailCard>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
