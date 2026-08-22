import { ActivityFooter } from "@/workspace/ActivityFooter";
import { ComparePanel } from "@/workspace/ComparePanel";
import { MapPanel } from "@/workspace/MapPanel";
import { OperationsPanel } from "@/workspace/OperationsPanel";
import { QueuePanel } from "@/workspace/QueuePanel";
import { WorkspaceHeader } from "@/workspace/WorkspaceHeader";
import { WorkspaceSelectionProvider } from "@/workspace/WorkspaceSelectionProvider";

/** Main dispatch grid with queue on the left, map in the center, and operations plus compare on the right. */
export function CommandCenterShell(): React.ReactElement {
  return (
    <WorkspaceSelectionProvider>
      <div className="flex h-svh min-h-0 flex-col gap-workspace-gap bg-background p-workspace-padding">
        <div className="flex min-h-0 flex-1 gap-workspace-gap">
          <QueuePanel className="w-queue-width shrink-0" />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-workspace-gap">
            <WorkspaceHeader />
            <div className="flex min-h-0 flex-1 flex-col gap-workspace-gap">
              <MapPanel className="min-h-[38%] flex-[1.2]" />
              <div className="flex min-h-0 flex-1 gap-workspace-gap">
                <OperationsPanel className="min-w-0 flex-1" />
                <ComparePanel className="min-w-0 flex-1" />
              </div>
            </div>
          </div>
        </div>
        <ActivityFooter />
      </div>
    </WorkspaceSelectionProvider>
  );
}
