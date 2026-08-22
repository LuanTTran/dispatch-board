import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PartsPathBadge } from "@/lenses/compare/PartsPathBadge";
import type { CompareTechData } from "@/lenses/compare/types";

type CompareTechCardProps = {
  tech: CompareTechData;
  isAssignTarget: boolean;
  onSelectForAssign: () => void;
};

/** One side-by-side compare column showing parts path, staleness, and assign target. */
export function CompareTechCard({
  tech,
  isAssignTarget,
  onSelectForAssign,
}: CompareTechCardProps): React.ReactElement {
  const { partsPath } = tech;

  return (
    <article
      className={cn(
        "relative flex h-full min-h-0 flex-col rounded-lg border p-3 pb-12",
        isAssignTarget
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-muted/20",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <header className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">{tech.label}</h3>
          <p className="text-xs text-muted-foreground">
            {tech.skillsLabel} · {tech.jobsLeftLabel}
          </p>
        </header>

        <div className="space-y-1 text-sm">
          <p className="text-foreground">
            Part: {partsPath.sourceLabel} · {partsPath.skuId} · qty {partsPath.quantity}
          </p>
          {partsPath.supplementLabel !== undefined ? (
            <p className="text-muted-foreground">{partsPath.supplementLabel}</p>
          ) : null}
          <p className="text-muted-foreground">asOf {partsPath.asOfLabel}</p>
          <PartsPathBadge status={partsPath.status} label={partsPath.statusLabel} />
        </div>

        <p
          className={cn(
            "text-sm",
            tech.locationStale ? "text-status-warning-foreground" : "text-muted-foreground",
          )}
        >
          Location: {tech.locationLabel}
          {tech.locationStale ? " ⚠" : null}
        </p>
      </div>

      <Button
        type="button"
        variant={isAssignTarget ? "default" : "outline"}
        size="sm"
        className="absolute inset-x-3 bottom-3 shrink-0"
        onClick={onSelectForAssign}
      >
        Select for assign
      </Button>
    </article>
  );
}
