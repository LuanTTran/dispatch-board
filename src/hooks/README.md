# hooks

Data hooks that read from Foundry through the OSDK and return view models for panels. This is where ontology objects become UI ready shapes.

- `useHasLoadedOnce.ts` - True after the first settled load so refetch does not remount skeletons.
- `useOpenWorkOrderPool.ts` - OPEN urgent work orders. Mounted once by `OpenWorkOrderPoolProvider`.
- `useOpenWorkOrders.ts` - Queue rows mapped from the shared OPEN work-order pool.
- `useFocusedJob.ts` - Loads the focused work order plus site, equipment, predictions, hub stock, and prior decisions.
- `useTechnicianPool.ts` - Chicago-hub technicians plus today's assignment counts. Mounted once by `TechnicianPoolProvider`.
- `useTechCandidates.ts` - Candidate checkbox rows mapped from the shared technician pool.
- `useTechCompare.ts` - Compare columns for 1–2 selected techs (predictions, truck/hub path). Reads techs and assignments from the pool. Mounted once by `CompareDataProvider`.
- `useTechnicianAssignmentCounts.ts` - Today's active assignment counts per technician. Used by `useTechnicianPool`.
- `useMapSites.ts` - Joins the shared OPEN work-order pool with customer sites for map site pins.
- `useMapTechnicians.ts` - Map tech pins mapped from the shared technician pool.
- `useRecentDispatchDecisions.ts` - Newest dispatch decisions; footer strip slices the same page as the full log.
- `useConfirmDispatch.ts` - Wraps the governed `confirmDispatch` OSDK action.
- `useHoldWorkOrder.ts` - Wraps the `holdWorkOrder` OSDK action.
- `useMountEffect.ts` — One shot effect used for map focus and popup sync on mount.
- `useMultipassCurrentUser.ts` - Signed-in Multipass user (`/api/me`) for activity actor usernames.
