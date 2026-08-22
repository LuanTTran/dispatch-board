import { cn } from "@/lib/utils";

type WorkspacePanelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Rounded card shell. Sizing comes from the grid parent.
 * Loading placeholders live in panel consumers via optional isLoading and skeletons. */
export function WorkspacePanel({
  children,
  className,
}: WorkspacePanelProps): React.ReactElement {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {children}
    </section>
  );
}
