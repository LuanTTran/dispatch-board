export type ThemeMode = "light" | "dark";

/**
 * Operational status colors for success, warning, danger, info, and delayed states.
 * Also used for parts-path green, yellow, and red signals.
 */
export type StatusColorTokens = {
  success: string;
  successForeground: string;
  successMuted: string;
  warning: string;
  warningForeground: string;
  warningMuted: string;
  danger: string;
  dangerForeground: string;
  dangerMuted: string;
  /** In-transit or loading state color. */
  info: string;
  infoForeground: string;
  infoMuted: string;
  /** Delayed or at-risk state color. */
  delayed: string;
  delayedForeground: string;
  delayedMuted: string;
};

export type ThemeTokens = {
  /** Main canvas background. */
  background: string;
  foreground: string;
  /** Panel and card surface background. */
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  /** Inset background for map placeholders and chart wells. */
  muted: string;
  /** Secondary label text color. */
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  /** Navigation rail background. Deepest layer in the shell. */
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  status: StatusColorTokens;
};

/** Shared status hues mapped to oklch for light and dark modes. */
const statusReference = {
  success: "oklch(0.84 0.22 130)", // Delivered status (#A3E635)
  warning: "oklch(0.86 0.17 95)", // In-transit status (#FACC15)
  danger: "oklch(0.72 0.17 25)", // Cancelled status (#F87171)
  info: "oklch(0.78 0.14 210)", // Loading status (#22D3EE)
  delayed: "oklch(0.55 0.12 195)", // Delayed status (#0D9488)
} as const;

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: {
    background: "oklch(0.955 0.006 260)",
    foreground: "oklch(0.20 0.012 260)",
    card: "oklch(0.99 0.002 260)",
    cardForeground: "oklch(0.20 0.012 260)",
    popover: "oklch(0.99 0.002 260)",
    popoverForeground: "oklch(0.20 0.012 260)",
    primary: "oklch(0.22 0.012 260)",
    primaryForeground: "oklch(0.98 0.004 260)",
    secondary: "oklch(0.935 0.008 260)",
    secondaryForeground: "oklch(0.22 0.012 260)",
    muted: "oklch(0.942 0.008 260)",
    mutedForeground: "oklch(0.52 0.01 260)",
    accent: "oklch(0.938 0.008 260)",
    accentForeground: "oklch(0.22 0.012 260)",
    destructive: statusReference.danger,
    border: "oklch(0.905 0.01 260)",
    input: "oklch(0.922 0.008 260)",
    ring: "oklch(0.62 0.015 260)",
    sidebar: "oklch(0.975 0.008 260)",
    sidebarForeground: "oklch(0.20 0.012 260)",
    sidebarPrimary: "oklch(0.22 0.012 260)",
    sidebarPrimaryForeground: "oklch(0.98 0.004 260)",
    sidebarAccent: "oklch(0.938 0.008 260)",
    sidebarAccentForeground: "oklch(0.22 0.012 260)",
    sidebarBorder: "oklch(0.905 0.01 260)",
    sidebarRing: "oklch(0.62 0.015 260)",
    status: {
      success: "oklch(0.90 0.12 130)",
      successForeground: "oklch(0.42 0.14 130)",
      successMuted: "oklch(0.94 0.06 130)",
      warning: "oklch(0.92 0.12 95)",
      warningForeground: "oklch(0.44 0.14 85)",
      warningMuted: "oklch(0.95 0.06 95)",
      danger: "oklch(0.90 0.10 25)",
      dangerForeground: "oklch(0.42 0.16 25)",
      dangerMuted: "oklch(0.94 0.05 25)",
      info: "oklch(0.90 0.08 210)",
      infoForeground: "oklch(0.40 0.12 210)",
      infoMuted: "oklch(0.94 0.04 210)",
      delayed: "oklch(0.88 0.06 195)",
      delayedForeground: "oklch(0.38 0.10 195)",
      delayedMuted: "oklch(0.93 0.04 195)",
    },
  },
  dark: {
    background: "oklch(0.185 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.22 0 0)",
    cardForeground: "oklch(0.985 0 0)",
    popover: "oklch(0.22 0 0)",
    popoverForeground: "oklch(0.985 0 0)",
    primary: "oklch(0.985 0 0)",
    primaryForeground: "oklch(0.145 0 0)",
    secondary: "oklch(0.26 0 0)",
    secondaryForeground: "oklch(0.985 0 0)",
    muted: "oklch(0.24 0 0)",
    mutedForeground: "oklch(0.58 0 0)",
    accent: "oklch(0.26 0 0)",
    accentForeground: "oklch(0.985 0 0)",
    destructive: statusReference.danger,
    border: "oklch(0.28 0 0)",
    input: "oklch(0.26 0 0)",
    ring: "oklch(0.45 0 0)",
    sidebar: "oklch(0.145 0 0)",
    sidebarForeground: "oklch(0.985 0 0)",
    sidebarPrimary: "oklch(0.985 0 0)",
    sidebarPrimaryForeground: "oklch(0.145 0 0)",
    sidebarAccent: "oklch(0.22 0 0)",
    sidebarAccentForeground: "oklch(0.985 0 0)",
    sidebarBorder: "oklch(0.24 0 0)",
    sidebarRing: "oklch(0.45 0 0)",
    status: {
      success: statusReference.success,
      successForeground: "oklch(0.145 0 0)",
      successMuted: "oklch(0.28 0.06 130)",
      warning: statusReference.warning,
      warningForeground: "oklch(0.20 0 0)",
      warningMuted: "oklch(0.30 0.05 95)",
      danger: statusReference.danger,
      dangerForeground: "oklch(0.985 0 0)",
      dangerMuted: "oklch(0.28 0.05 25)",
      info: statusReference.info,
      infoForeground: "oklch(0.145 0 0)",
      infoMuted: "oklch(0.26 0.04 210)",
      delayed: statusReference.delayed,
      delayedForeground: "oklch(0.985 0 0)",
      delayedMuted: "oklch(0.26 0.04 195)",
    },
  },
};

function tokensToCssVariables(tokens: ThemeTokens): string {
  const entries: Record<string, string> = {
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens.cardForeground,
    "--popover": tokens.popover,
    "--popover-foreground": tokens.popoverForeground,
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens.secondaryForeground,
    "--muted": tokens.muted,
    "--muted-foreground": tokens.mutedForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--destructive": tokens.destructive,
    "--border": tokens.border,
    "--input": tokens.input,
    "--ring": tokens.ring,
    "--sidebar": tokens.sidebar,
    "--sidebar-foreground": tokens.sidebarForeground,
    "--sidebar-primary": tokens.sidebarPrimary,
    "--sidebar-primary-foreground": tokens.sidebarPrimaryForeground,
    "--sidebar-accent": tokens.sidebarAccent,
    "--sidebar-accent-foreground": tokens.sidebarAccentForeground,
    "--sidebar-border": tokens.sidebarBorder,
    "--sidebar-ring": tokens.sidebarRing,
    "--status-success": tokens.status.success,
    "--status-success-foreground": tokens.status.successForeground,
    "--status-success-muted": tokens.status.successMuted,
    "--status-warning": tokens.status.warning,
    "--status-warning-foreground": tokens.status.warningForeground,
    "--status-warning-muted": tokens.status.warningMuted,
    "--status-danger": tokens.status.danger,
    "--status-danger-foreground": tokens.status.dangerForeground,
    "--status-danger-muted": tokens.status.dangerMuted,
    "--status-info": tokens.status.info,
    "--status-info-foreground": tokens.status.infoForeground,
    "--status-info-muted": tokens.status.infoMuted,
    "--status-delayed": tokens.status.delayed,
    "--status-delayed-foreground": tokens.status.delayedForeground,
    "--status-delayed-muted": tokens.status.delayedMuted,
    "--chart-1": tokens.status.success,
    "--chart-2": tokens.status.warning,
    "--chart-3": tokens.status.info,
    "--chart-4": tokens.status.delayed,
    "--chart-5": tokens.status.danger,
  };

  return Object.entries(entries)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

/** Static CSS for :root and .dark. Consumed by ThemeStyles without useEffect. */
export function buildThemeCss(): string {
  return `:root {
${tokensToCssVariables(themes.light)}
}

.dark {
${tokensToCssVariables(themes.dark)}
}`;
}
