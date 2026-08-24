import { ActivityFooter } from "@/workspace/ActivityFooter";
import { CompareDataProvider } from "@/workspace/CompareDataProvider";
import { ComparePanel } from "@/workspace/ComparePanel";
import { FoundryCurrentUserProvider } from "@/workspace/FoundryCurrentUserProvider";
import { MapPanel } from "@/workspace/MapPanel";
import { OpenWorkOrderPoolProvider } from "@/workspace/OpenWorkOrderPoolProvider";
import { OperationsPanel } from "@/workspace/OperationsPanel";
import { QueuePanel } from "@/workspace/QueuePanel";
import { TechnicianPoolProvider } from "@/workspace/TechnicianPoolProvider";
import { WorkspaceHeader } from "@/workspace/WorkspaceHeader";
import { WorkspaceSelectionProvider } from "@/workspace/WorkspaceSelectionProvider";

/** Main dispatch grid with queue on the left, map in the center, and operations plus compare on the right. */
export function CommandCenterShell(): React.ReactElement {
  return (
    <WorkspaceSelectionProvider>
      <FoundryCurrentUserProvider>
        <div className="flex h-svh min-h-0 flex-col gap-workspace-gap bg-background p-workspace-padding">
          <OpenWorkOrderPoolProvider>
            <div className="flex min-h-0 flex-1 gap-workspace-gap">
              <QueuePanel className="w-queue-width shrink-0" />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-workspace-gap">
                <WorkspaceHeader />
                <TechnicianPoolProvider>
                  <div className="flex min-h-0 flex-1 flex-col gap-workspace-gap">
                    <MapPanel className="min-h-[38%] flex-[1.2]" />
                    <div className="flex min-h-0 flex-1 gap-workspace-gap">
                      <CompareDataProvider>
                        <OperationsPanel className="min-w-0 flex-1" />
                        <ComparePanel className="min-w-0 flex-1" />
                      </CompareDataProvider>
                    </div>
                  </div>
                </TechnicianPoolProvider>
              </div>
            </div>
          </OpenWorkOrderPoolProvider>
          <ActivityFooter />
        </div>
      </FoundryCurrentUserProvider>
    </WorkspaceSelectionProvider>
  );
}
