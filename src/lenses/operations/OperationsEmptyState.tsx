/** Empty state when no work order is focused. Queue or map selection sets focus later. */
export function OperationsEmptyState(): React.ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center p-panel-padding">
      <p className="text-center text-sm text-muted-foreground">
        Select a work order
        <br />
        from the queue or map
      </p>
    </div>
  );
}
