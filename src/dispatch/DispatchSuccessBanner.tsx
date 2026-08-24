import { CircleCheckIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DispatchSuccessBannerProps = {
  workOrderId: string;
  technicianId: string;
};

/** In-panel confirmation after a successful ConfirmDispatch. */
export function DispatchSuccessBanner({
  workOrderId,
  technicianId,
}: DispatchSuccessBannerProps): React.ReactElement {
  return (
    <Alert className="border-status-success/30 bg-status-success-muted text-status-success-foreground">
      <CircleCheckIcon />
      <AlertTitle>Dispatch confirmed</AlertTitle>
      <AlertDescription className="text-status-success-foreground/80">
        Assigned {technicianId} to {workOrderId}
      </AlertDescription>
    </Alert>
  );
}
