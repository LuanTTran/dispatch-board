import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const TECH_ROW_COUNT = 4;

/** Placeholder for job card and tech list while the focused work order loads. */
export function OperationsPanelSkeleton(): React.ReactElement {
  return (
    <ScrollArea
      className="min-h-0 flex-1"
      aria-busy="true"
      aria-label="Loading operations"
    >
      <div className="flex flex-col gap-4 p-panel-padding">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4 max-w-xs rounded-md" />
          <Skeleton className="h-4 w-1/2 max-w-[12rem] rounded-md" />
        </header>

        <Separator />

        <Skeleton className="h-4 w-24 rounded-md" />

        <section className="space-y-2">
          <Skeleton className="h-3 w-32 rounded-md" />
          <ul className="space-y-1">
            {Array.from({ length: TECH_ROW_COUNT }, (_, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-lg px-2 py-2"
              >
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
                <Skeleton className="h-3 w-12 shrink-0 rounded-md" />
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>
    </ScrollArea>
  );
}
