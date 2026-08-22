type CompareEmptyStateProps = {
  /** Zero means none checked. One means a second technician must be selected. */
  selectedCount: 0 | 1;
  hasFocusedWorkOrder: boolean;
};

/** Guidance when fewer than two technicians are selected for compare. */
export function CompareEmptyState({
  selectedCount,
  hasFocusedWorkOrder,
}: CompareEmptyStateProps): React.ReactElement {
  if (!hasFocusedWorkOrder) {
    return (
      <div className="flex flex-1 items-center justify-center p-panel-padding">
        <p className="text-center text-sm text-muted-foreground">
          Select a work order
          <br />
          to compare technicians
        </p>
      </div>
    );
  }

  if (selectedCount === 1) {
    return (
      <div className="flex flex-1 items-center justify-center p-panel-padding">
        <p className="text-center text-sm text-muted-foreground">
          Select one more technician
          <br />
          for side-by-side compare
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-panel-padding">
      <p className="text-center text-sm text-muted-foreground">
        Select up to two technicians
        <br />
        to compare parts paths
      </p>
    </div>
  );
}
