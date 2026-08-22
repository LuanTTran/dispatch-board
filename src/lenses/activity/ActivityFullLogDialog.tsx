import { ActivityDecisionLine } from "@/lenses/activity/ActivityDecisionLine";
import type { DispatchDecisionData } from "@/lenses/activity/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActivityFullLogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decisions: DispatchDecisionData[];
};

/** Full dispatch audit log showing all decisions, newest first. */
export function ActivityFullLogDialog({
  open,
  onOpenChange,
  decisions,
}: ActivityFullLogDialogProps): React.ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(36rem,85vh)] flex-col gap-4 overflow-hidden p-6 sm:max-w-xl">
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle>Dispatch activity log</DialogTitle>
          <DialogDescription>
            {decisions.length} decision{decisions.length === 1 ? "" : "s"} — newest first
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          {decisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dispatch decisions recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 pb-1">
              {decisions.map((decision) => (
                <li key={decision.decisionId}>
                  <ActivityDecisionLine decision={decision} variant="log" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
