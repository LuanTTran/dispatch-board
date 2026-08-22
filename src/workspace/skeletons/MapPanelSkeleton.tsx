import { Skeleton } from "@/components/ui/skeleton";

/** Full-bleed map placeholder shown while site and tech pins load. */
export function MapPanelSkeleton(): React.ReactElement {
  return (
    <div
      className="relative min-h-0 flex-1 overflow-hidden"
      aria-busy="true"
      aria-label="Loading map"
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 flex items-center justify-center gap-3 p-6">
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-3 rounded-full" />
      </div>
    </div>
  );
}
