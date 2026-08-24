import { Button } from "@/components/ui/button";
import { PartsPathBadge } from "@/lenses/compare/PartsPathBadge";
import type { CompareTechData } from "@/lenses/compare/types";
import { cn } from "@/lib/utils";

type CompareTechCardProps = {
  tech: CompareTechData;
  isAssignTarget: boolean;
  isAssigned?: boolean;
  assignLocked?: boolean;
  onSelectForAssign: () => void;
};

/** One side-by-side compare column showing parts path, staleness, and assign target. */
export function CompareTechCard({
  tech,
  isAssignTarget,
  isAssigned = false,
  assignLocked = false,
  onSelectForAssign,
}: CompareTechCardProps): React.ReactElement {
  const { partsPath } = tech;

  return (
    <article
      className={cn(
        "grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 rounded-lg border px-3 pt-3 pb-4",
        isAssigned
          ? "border-status-success bg-status-success-muted/40 ring-1 ring-status-success/30"
          : isAssignTarget
            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
            : "border-border bg-muted/20",
      )}
    >
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
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
      </div>

      <div className="flex flex-col gap-2">
        <p
          className={cn(
            "text-sm",
            tech.locationStale ? "text-status-warning-foreground" : "text-muted-foreground",
          )}
        >
          Location: {tech.locationLabel}
          {tech.locationStale ? " ⚠" : null}
        </p>

        <Button
          type="button"
          variant={isAssigned ? "default" : isAssignTarget ? "default" : "outline"}
          size="sm"
          className="w-full shrink-0"
          disabled={assignLocked}
          onClick={onSelectForAssign}
        >
          {isAssigned ? "Assigned" : "Select for assign"}
        </Button>
      </div>
    </article>
  );
}
