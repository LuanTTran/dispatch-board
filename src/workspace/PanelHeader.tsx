type PanelHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

/** Renders the panel title row. */
export function PanelHeader({ title, action }: PanelHeaderProps): React.ReactElement {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-panel-padding">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      {action}
    </div>
  );
}
