# utils

Pure mapping, formatting, and classification. No React. Hooks call these to turn OSDK objects into lens and panel view models.

**`activity/`** - Maps `DispatchDecision` ontology rows to activity feed shapes.

**`dispatch/`** - Parts path classification (green/yellow/red), confirm payload builders, skills labels, action error messages, jobs left counts.

**`format/`** - Shared timestamp formatting for decision and audit rows.

**`operations/`** - Maps focused work orders and technicians into job card and candidate checkbox data.

**`queue/`** - Maps work orders to queue list items and SLA countdown labels.

**`spatial/`** - Groups work orders by customer site for map pins and maps technician coords for map markers.

**`staleness/`** - Age labels and stale checks for truck inventory, hub inventory, and technician location.
