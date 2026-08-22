import { Badge } from "@/components/ui/badge";
import type { JobCardData } from "@/lenses/operations/types";

type JobCardHeaderProps = {
  job: Pick<
    JobCardData,
    "workOrderId" | "slaLabel" | "priorityLabel" | "siteOneLiner" | "equipmentOneLiner"
  >;
};

/** Focused work order summary shown as read-only context at the top of the operations panel. */
export function JobCardHeader({ job }: JobCardHeaderProps): React.ReactElement {
  return (
    <header className="space-y-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h2 className="text-base font-semibold text-foreground">{job.workOrderId}</h2>
        <span className="text-sm text-muted-foreground">·</span>
        <span className="text-sm tabular-nums text-status-danger-foreground">
          SLA {job.slaLabel}
        </span>
        <span className="text-sm text-muted-foreground">·</span>
        <Badge variant="destructive" className="uppercase">
          {job.priorityLabel}
        </Badge>
      </div>
      <p className="text-sm text-foreground">{job.siteOneLiner}</p>
      <p className="text-sm text-muted-foreground">{job.equipmentOneLiner}</p>
    </header>
  );
}
