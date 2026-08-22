# hooks

Data hooks that read from Foundry through the OSDK and return view models for panels. This is where ontology objects become UI ready shapes.

- `useOpenWorkOrders.ts` — Fetches OPEN urgent work orders for the queue panel.
- `useFocusedJob.ts` — Loads the focused work order plus site, equipment, predictions, hub stock, and prior decisions.
- `useTechCandidates.ts` — Chicago hub technician pool with jobs left counts for the checkbox list.
- `useTechCompare.ts` — Side by side compare data for two selected techs (truck and hub inventory).
- `useSelectedTechCompare.ts` — Single assign target compare column for the confirm dialog.
- `useTechnicianAssignmentCounts.ts` — Today's active assignment counts per technician.
- `useMapSites.ts` — Joins OPEN work orders with customer sites for map site pins.
- `useMapTechnicians.ts` — Chicago hub technicians with coords and jobs left for map tech pins.
- `useRecentDispatchDecisions.ts` — Recent dispatch decisions for the activity footer.
- `useConfirmDispatch.ts` — Wraps the governed `confirmDispatch` OSDK action.
- `useHoldWorkOrder.ts` — Wraps the `holdWorkOrder` OSDK action.
- `useMountEffect.ts` — One shot effect used for map focus and popup sync on mount.
