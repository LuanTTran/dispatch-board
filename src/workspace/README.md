# workspace

The command center shell. Four panels plus a footer share one selection state (focused work order, compare picks, assign target). Queue, map, and operations stay in sync.

- `CommandCenterShell.tsx` — Main layout grid: queue, header, map, operations, compare, activity footer.
- `WorkspaceSelectionProvider.tsx` — Shared context for focused work order, compare tech IDs, assign target, and focus source.
- `focusSource.ts` — Tracks whether focus came from the queue or the map (drives map popup behavior).
- `WorkspacePanel.tsx` — Rounded card wrapper used by every panel.
- `PanelHeader.tsx` — Panel title row with optional trailing action slot.
- `WorkspaceHeader.tsx` — App title, region copy, and theme toggle.
- `QueuePanel.tsx` — Left column. OPEN queue with focus wiring, loading, and error retry.
- `MapPanel.tsx` — Center map. Loads sites and techs, shows partial error banner and skeleton.
- `OperationsPanel.tsx` — Job card, tech candidates, assign/hold dialogs, and OSDK action calls.
- `ComparePanel.tsx` — Side by side parts path compare when two techs are checked.
- `ActivityFooter.tsx` — Recent dispatch strip and full log dialog trigger.
- `skeletons/` — Loading placeholders for queue, map, operations, and compare panels.
