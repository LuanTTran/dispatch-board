import { ThemeToggle } from "@/components/ThemeToggle";
import { MapMarkerLegend } from "@/spatial/MapMarkerLegend";

/** Context bar above the grid showing region and filter copy. */
export function WorkspaceHeader(): React.ReactElement {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="truncate font-heading font-medium text-foreground">
          Dispatch Command Center
        </span>
        <span className="text-muted-foreground" aria-hidden>
          /
        </span>
        <span className="truncate text-muted-foreground">Central</span>
        <span className="text-muted-foreground" aria-hidden>
          ·
        </span>
        <span className="truncate text-muted-foreground">Urgent refrigeration</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <MapMarkerLegend />
        <ThemeToggle className="relative shrink-0" />
      </div>
    </header>
  );
}
