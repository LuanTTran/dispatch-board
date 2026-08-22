# dispatch

Assign and hold workflow. These components sit in the operations panel. They turn coordinator choices into governed Foundry actions. Nothing writes until the person confirms.

- `ActionBar.tsx` — Assign and Hold buttons that open the confirm dialogs.
- `ConfirmDispatchDialog.tsx` — Final review before sending a tech (parts path, stale data, override reason).
- `HoldWorkOrderDialog.tsx` — Put a job on hold when parts need a hub pull.
- `TechCandidateList.tsx` — Checkbox list to pick up to two techs for compare.
- `ConcurrencyErrorBanner.tsx` — Shows when another coordinator already claimed the tech.
- `confirmDispatchGuards.ts` — Rules that block confirm until stale or red path issues are acknowledged.
- `types.ts` — View model types for candidates and confirm payloads.
