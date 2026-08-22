/**
 * Workspace shell spacing tokens. Injected as CSS custom properties alongside theme tokens.
 */
export type LayoutTokens = {
  /** Outer shell inset padding. */
  workspacePadding: string;
  /** Gap between header, panels, and grid cells. */
  workspaceGap: string;
  /** Internal card padding. */
  panelPadding: string;
  /** Navigation rail width. */
  sidebarWidth: string;
  /** SLA queue column width. */
  queueWidth: string;
  /** Base corner radius for panels. */
  radius: string;
  /** Smaller corner radius for badges and chips. */
  radiusBadge: string;
};

export const layoutTokens: LayoutTokens = {
  workspacePadding: "0.75rem",
  workspaceGap: "0.5rem",
  panelPadding: "1rem",
  sidebarWidth: "15rem",
  queueWidth: "16.25rem",
  radius: "0.875rem",
  radiusBadge: "0.25rem",
};

export function buildLayoutCss(): string {
  const entries: Record<string, string> = {
    "--radius": layoutTokens.radius,
    "--radius-badge": layoutTokens.radiusBadge,
    "--workspace-padding": layoutTokens.workspacePadding,
    "--workspace-gap": layoutTokens.workspaceGap,
    "--panel-padding": layoutTokens.panelPadding,
    "--sidebar-width": layoutTokens.sidebarWidth,
    "--queue-width": layoutTokens.queueWidth,
  };

  const block = Object.entries(entries)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `:root {\n${block}\n}`;
}
