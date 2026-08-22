import { Button } from "@/components/ui/button";

type ActionBarProps = {
  assignDisabled: boolean;
  assignLabel?: string;
  onAssign: () => void;
  onHold: () => void;
};

/** Assign and Hold buttons that open confirm dialogs. */
export function ActionBar({
  assignDisabled,
  assignLabel = "Assign",
  onAssign,
  onHold,
}: ActionBarProps): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Button type="button" disabled={assignDisabled} onClick={onAssign}>
        {assignLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onHold}>
        Hold — parts pick
      </Button>
    </div>
  );
}
