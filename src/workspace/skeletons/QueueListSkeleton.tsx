import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const ROW_COUNT = 8;

/** Placeholder rows while OPEN queue loads from OSDK. */
export function QueueListSkeleton(): React.ReactElement {
  return (
    <ScrollArea className="min-h-0 flex-1" aria-busy="true" aria-label="Loading queue">
      <div className="flex flex-col py-1">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 border-l-2 border-l-transparent px-panel-padding py-2.5"
          >
            <Skeleton className="size-2 shrink-0 rounded-full" />
            <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
            <Skeleton className="h-3 w-10 shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
