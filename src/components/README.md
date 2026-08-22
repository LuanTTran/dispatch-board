# components

Shared UI shell for the app. Theme wiring lives here. Reusable button and dialog pieces live in `ui/`.

- `ThemeProvider.tsx` — Wraps the app with light/dark theme context.
- `ThemeStyles.tsx` — Injects font faces, layout tokens, and color CSS variables.
- `ThemeToggle.tsx` — Light/dark toggle in the workspace header.
- `ui/` — Shadcn/Radix primitives (button, dialog, checkbox, scroll area, and others). No app logic. Used by panels and dispatch dialogs.
