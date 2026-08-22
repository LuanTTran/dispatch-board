---
name: osdk
description: >-
  Palantir Ontology SDK (OSDK) TypeScript/React guidelines for this Foundry-backed
  SPA. ACTIVATE when querying ontology objects, links, actions, OAuth/client setup,
  OsdkProvider, @osdk/react hooks, generated SDK imports, subscriptions/streamUpdates,
  cache invalidation, or Foundry deploy auth. Prefer @osdk/react over raw client loops.
  Cross-references vite and no-use-effect skills.
---

# OSDK — Ontology SDK (TypeScript / React)

Foundry **is** the backend. The generated Ontology SDK is the API contract.
Use **OSDK v2** (`createClient` + `@osdk/react`). Do not introduce OSDK 1.x (`FoundryClient`).

Official refs:

- [OSDK overview](https://www.palantir.com/docs/foundry/ontology-sdk/overview/)
- [osdk-ts React docs](https://palantir.github.io/osdk-ts/)
- [Bootstrap TypeScript app](https://www.palantir.com/docs/foundry/ontology-sdk/how-to-bootstrapping-typescript/)
- [TS 1.x → 2.0 migration](https://www.palantir.com/docs/foundry/ontology-sdk/typescript-osdk-migration/)
- [Subscriptions](https://www.palantir.com/docs/foundry/ontology-sdk/typescript-subscriptions/)
- [Vite + OSDK](https://palantir.github.io/osdk-ts/guides/vite)

Related: [vite](../vite/SKILL.md) (SPA layers), [no-use-effect](../no-use-effect/SKILL.md).

## Non-negotiables

1. **Fully use `@osdk/react` for ontology data** — `useOsdkObjects`, `useOsdkObject`, `useLinks`, `useOsdkAction`, `useObjectSet`, `useOsdkAggregation`, `useOsdkFunction` as appropriate.
2. Wrap the app in **`OsdkProvider`** at the root (already in `main.tsx`). All hooks must run under it.
3. Import object types / actions from the **generated package** (`@dispatch-command-board/sdk` or current `package.json` name) — never invent entity shapes.
4. **No second source of truth** — do not copy OSDK objects into Redux / TanStack Query / mirrored `useState`. Cache is normalized inside `OsdkProvider`.
5. **Mutations only via Actions** (e.g. `ConfirmDispatch`) from event handlers — never silent writes; surface validation / concurrency errors.
6. Keep `@osdk/client`, `@osdk/react`, `@osdk/api` on **compatible versions**. Mismatches → `"Property 'store' is missing"` etc.
7. Follow **no-use-effect**: OSDK hooks replace effect-based fetching; actions run in click/submit handlers.

TanStack Query is OK only for **non-Foundry** HTTP. Ontology → `@osdk/react` only.

## Client & auth

Project pattern (`src/client.ts`): meta tags → `createPublicOauthClient` + `createClient`.

```ts
import { createClient } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";

export const auth = createPublicOauthClient(clientId, foundryUrl, redirectUrl, { scopes });
export const client = createClient(foundryUrl, ontologyRid, auth);
```

- Public OAuth (client-facing app), redirect `/auth/callback`, scopes include ontologies read/write as configured.
- Single client instance — never `createClient(...)` inside render.
- Vite **must** define `process.env.NODE_ENV` (see vite skill) or OSDK throws `process is not defined`.
- Secrets: `FOUNDRY_TOKEN` / client secrets only in env — never commit.

```tsx
<OsdkProvider client={client}>
  <RouterProvider router={router} />
</OsdkProvider>
```

Optional dev knobs: `devMode={{ actionDelayMs, logLevel, debug }}` on `OsdkProvider`.

## Hook cheat sheet

| Need | Hook |
| --- | --- |
| List / filter / page objects | `useOsdkObjects(Type, opts)` |
| One object by PK or track instance | `useOsdkObject(Type, pk)` or `useOsdkObject(instance)` |
| Traverse links from instance(s) | `useLinks(objectOrArray, "linkName", opts)` |
| Apply / validate action | `useOsdkAction(action)` |
| Composed ObjectSets (union/intersect/subtract) | `useObjectSet(objectSet, opts)` — prefer `useOsdkObjects` when starting from a type |
| Aggregations | `useOsdkAggregation` |
| Ontology functions / queries | `useOsdkFunction` |
| Escape hatch in handlers | `useOsdkClient()` — rare; prefer hooks for reactive UI |
| Manual cache ops | `useObservableClient()` |

### Query patterns

```tsx
import { WorkOrder } from "@dispatch-command-board/sdk";
import { useOsdkObjects } from "@osdk/react";

const { data, isLoading, error, fetchMore, hasMore, refetch } = useOsdkObjects(
  WorkOrder,
  {
    where: { status: "unassigned", /* Path A filters */ },
    orderBy: { slaDeadline: "asc" },
    pageSize: 40,
    // streamUpdates: true,  // live list; NOT with pivotTo / withProperties
    // enabled: Boolean(focusId),
    // autoFetchMore: 100,   // prefer N over true on large sets
  },
);
```

**Filters:** `$startsWith`, `$containsAnyTerm`, `$containsAllTerms`, `$containsAllTermsInOrder`, ranges, null checks — use generated property names.

**Conditional fetch:** `enabled` option — never call hooks conditionally.

**Links / investigative context:**

```tsx
const { links: predictions, isLoading } = useLinks(workOrder, "partPredictions", {
  orderBy: { rank: "asc" },
});
```

Or `pivotTo` on `useOsdkObjects` / `useObjectSet` when the query starts from a filtered set (changes result type). Cannot combine `pivotTo` with `streamUpdates`.

**Single object:**

```tsx
const { object, isLoading, isOptimistic, error } = useOsdkObject(WorkOrder, workOrderId);
```

Keys: use `$primaryKey` in lists. Instances are immutable — use `$clone({ ... })` for optimistic patches.

### Actions

```tsx
import { confirmDispatch } from "@dispatch-command-board/sdk";
import { useOsdkAction } from "@osdk/react";

const { applyAction, validateAction, isPending, error, validationResult } =
  useOsdkAction(confirmDispatch);

// In a click/submit handler — not an effect:
await applyAction({
  workOrderId,
  technicianId,
  selectedPartSkuId,
  overrideReason,
  $optimisticUpdate: (ou) => {
    // ou.updateObject(instance.$clone({ ... }))
  },
});
```

- `validateAction` before confirm when UX needs pre-flight; validation and apply are mutually exclusive.
- Batch: `applyAction([{...}, {...}])`.
- Errors: prefer `error.actionValidation?.message` for governed failures (concurrency, parts guard); show who/when when conflict payload allows — do not silent-fail.
- After successful OSDK actions, **cache updates automatically** — do not `invalidateAll()` on every success.
- Raw client equivalent (non-React contexts only): `client(confirmDispatch).applyAction(params, { $returnEdits: true })`.

### Real-time updates

- Prefer `streamUpdates: true` on `useOsdkObjects` / `useObjectSet` for live queues/feeds.
- Low-level: `client(Type).where(...).subscribe({ onChange, onOutOfDate, onError })` — unsubscribe on cleanup via `useMountEffect` if ever needed; one subscription per query; no `.pivotTo` sets.
- On `onOutOfDate`, refetch the object set.

### Cache discipline

From [cache management](https://palantir.github.io/osdk-ts/react/cache-management):

- Reuse identical `where` / `orderBy` / params so components share one cache entry (module constants or stable objects).
- Let actions drive invalidation; manual `invalidateObjects` / `invalidateObjectType` only for external/non-OSDK changes.
- Avoid `invalidateAll()` on mount.
- `isOptimistic` on list = list **order** optimistic; per-object optimism → `useOsdkObject(instance)`.

## Ontology map (this product)

Use generated names from Developer Console if they differ slightly; align with PRD §6:

| Object | Role |
| --- | --- |
| `WorkOrder` | Urgency queue focus |
| `CustomerSite`, `Equipment` | Investigative context |
| `Technician` | Compare candidates (+ location age, no map in Path A) |
| `PartSku`, `PartPrediction` | Predicted parts |
| `TruckInventory`, `HubInventory` | Parts paths + `asOfTimestamp` staleness |
| `DispatchAssignment`, `DispatchDecision` | Assignment + audit / activity feed |

**Action:** `ConfirmDispatch` — human confirm only; parts red path needs `overrideReason`; concurrency must surface clearly.

Staleness / parts green-yellow-red classification → **pure utils** + presentation components; data still from OSDK hooks.

## Agent workflow

1. Confirm types/actions exist on generated SDK; regenerate in Developer Console if missing.
2. Put route composition in **screens**; wrap reads/actions in **hooks**; pure rules in **utils** (vite skill layers).
3. Implement UI against hook results (`data` / `object` / `links` / `isPending` / `error`).
4. Wire confirm through `useOsdkAction` in an event handler; handle validation errors in UI.
5. Lint/typecheck; manually verify OAuth + one read + one action against Developer Tier.

## Anti-patterns

| Avoid | Do instead |
| --- | --- |
| `useEffect` + `client(...).fetchPage` | `useOsdkObjects` / `useOsdkObject` |
| `client.ontology.objects.*` (v1) | `client(Type)` / React hooks |
| Duplicating objects into local state "for convenience" | Read from hooks; derive UI state |
| Silent `applyAction` without UI error path | Surface `actionValidation` / unknown errors |
| `streamUpdates` + `pivotTo` | Fetch without stream, or split queries |
| Hardcoded WO/tech IDs as business source of truth | Ontology primary keys from SDK instances |
