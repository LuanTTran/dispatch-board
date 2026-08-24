import { Button } from "@/components/ui/button";

type ActionBarProps = {
  assignDisabled: boolean;
  assignLabel?: string;
  holdDisabled?: boolean;
  onAssign: () => void;
  onHold: () => void;
};

/** Assign and Hold buttons that open confirm dialogs. */
export function ActionBar({
  assignDisabled,
  assignLabel = "Assign",
  holdDisabled = false,
  onAssign,
  onHold,
}: ActionBarProps): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Button type="button" disabled={assignDisabled} onClick={onAssign}>
        {assignLabel}
      </Button>
      <Button type="button" variant="outline" disabled={holdDisabled} onClick={onHold}>
        Hold — parts pick
      </Button>
    </div>
  );
}
