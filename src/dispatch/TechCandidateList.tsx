import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { TechCandidateData } from "@/dispatch/types";
import { MAX_COMPARE_TECHNICIANS } from "@/lenses/compare/types";

type TechCandidateListProps = {
  candidates: TechCandidateData[];
  selectedIds: string[];
  onToggle: (technicianId: string) => void;
};

/** Checkbox list with max two selections for compare. Feeds ComparePanel. */
export function TechCandidateList({
  candidates,
  selectedIds,
  onToggle,
}: TechCandidateListProps): React.ReactElement {
  const atMax = selectedIds.length >= MAX_COMPARE_TECHNICIANS;

  return (
    <section className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Who can take this?
      </h3>
      <ul className="space-y-1">
        {candidates.map((candidate) => {
          const isSelected = selectedIds.includes(candidate.technicianId);
          const isDisabled = atMax && !isSelected;

          return (
            <li key={candidate.technicianId}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                  isSelected ? "bg-accent/50" : "hover:bg-muted/50",
                  isDisabled && "cursor-not-allowed opacity-50",
                )}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  onCheckedChange={() => onToggle(candidate.technicianId)}
                />
                <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                  {candidate.label}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {candidate.jobsLeftLabel}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
