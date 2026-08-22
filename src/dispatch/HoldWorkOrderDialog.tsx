import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { HoldWorkOrderPayload } from "@/dispatch/types";

type HoldWorkOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: HoldWorkOrderPayload | null;
  isSubmitting?: boolean;
  actionError?: string | null;
  onHold: (note: string) => void | Promise<void>;
};

const HOLD_REASON = "Parts pick (hub pull required)";

/** Hold dialog for hub parts pull. Uses a fixed reason plus an optional note. */
export function HoldWorkOrderDialog({
  open,
  onOpenChange,
  payload,
  isSubmitting = false,
  actionError = null,
  onHold,
}: HoldWorkOrderDialogProps): React.ReactElement {
  const [note, setNote] = useState("");

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setNote("");
    }
    onOpenChange(nextOpen);
  };

  const handleHold = (): void => {
    onHold(note.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Hold work order</DialogTitle>
          {payload !== null ? (
            <DialogDescription>
              {payload.workOrderId} · {payload.symptomOneLiner}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {payload !== null ? (
          <div className="space-y-4">
            {actionError !== null ? (
              <Alert variant="destructive">
                <AlertTitle>Hold failed</AlertTitle>
                <AlertDescription className="text-balance">{actionError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="text-sm font-medium text-foreground">{HOLD_REASON}</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hold-note" className="text-sm font-medium text-foreground">
                Note (optional)
              </label>
              <Textarea
                id="hold-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Awaiting hub pull for predicted SKU"
                rows={3}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={isSubmitting} onClick={handleHold}>
            Hold work order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
