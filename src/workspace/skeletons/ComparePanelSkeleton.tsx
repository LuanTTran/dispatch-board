import { Skeleton } from "@/components/ui/skeleton";

/** Two-column compare placeholder while tech parts paths load. */
export function ComparePanelSkeleton(): React.ReactElement {
  return (
    <div
      className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 items-stretch gap-3 p-panel-padding"
      aria-busy="true"
      aria-label="Loading compare"
    >
      {Array.from({ length: 2 }, (_, index) => (
        <article
          key={index}
          className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-border px-3 pt-3 pb-4"
        >
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
            <header className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </header>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-8 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  );
}
