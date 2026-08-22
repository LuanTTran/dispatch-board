# constants

Domain rules and design tokens for the workspace. Values here become CSS custom properties or shared filters for OSDK queries.

- `dispatch.ts` — Chicago hub ID, tech candidate page size, inventory staleness threshold (2 hours).
- `font.ts` — Self hosted font paths and `buildFontFaceCss()` for injection.
- `layout.ts` — Panel spacing, widths, radii, and `buildLayoutCss()`.
- `queue.ts` — OPEN work order filter, SLA urgency thresholds, page size, urgency buckets.
- `spatial.ts` — Map page sizes, fly to duration, marker z index, Chicago hub coordinates.
- `theme.ts` — Light/dark color tokens (including status colors) and `buildThemeCss()`.
