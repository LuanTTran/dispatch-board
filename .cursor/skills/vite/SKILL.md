---
name: vite
description: >-
  Guidelines for building this Vite 8 + React + TypeScript client-side SPA on
  Palantir OSDK. ACTIVATE when writing React/Vite code, scaffolding features,
  structuring src/, reviewing frontend PRs, configuring vite.config, env vars,
  HMR/build, or routing screens. Enforces layered architecture, concise comments,
  and no-use-effect. Cross-references the OSDK and no-use-effect skills.
---

# Vite — Dispatch Command Center

Client-side SPA: **Vite 8 + React + TypeScript** on **Palantir Foundry OSDK**.
Foundry is the backend. No Next.js / SSR. Static `dist/` → Foundry web hosting.

## Related skills (always apply)

| Skill | When |
| --- | --- |
| [no-use-effect](../no-use-effect/SKILL.md) | Any React component — never call `useEffect` directly |
| [OSDK](../OSDK/SKILL.md) | All Foundry/ontology reads, actions, links, auth client |

For ontology data: use `@osdk/react` hooks (see OSDK skill), **not** ad-hoc `fetch` + `useEffect`, and not TanStack Query for Foundry objects.

## Principles (verbatim)

> write good code .
> Add concises comment on code .
> Hierarchical layers , build reusable components, separate logics/ functions in utils , build reusable hooks. Keep screen for routing.
> this is a client-side project , build on top of Palantir OSDK .

## Code quality

- Prefer small, typed, readable units over clever abstractions.
- Add **concise** comments only where intent is non-obvious (why, not what). Skip narrating obvious code.
- Match existing project style (`@/` alias, Prettier, ESLint).
- Follow [no-use-effect](../no-use-effect/SKILL.md) replacement patterns.
- Domain types and business entities come from the **generated OSDK package** — do not hardcode ontology shapes.

## Hierarchical layers

Keep responsibilities separated. Screens own routing composition; they do not bury query/action logic or one-off helpers.

| Layer | Owns | Does not own |
| --- | --- | --- |
| **Screens** | Route entry, layout composition, wire hooks → UI | Business algorithms, raw OSDK calls duplicated inline |
| **Components** | Reusable presentational / interactive UI | Routing; opaque data-fetch sprawl |
| **Hooks** | Reusable state + OSDK data/action orchestration | JSX layout for whole pages |
| **Utils** | Pure helpers, formatting, guards, constants | React hooks, JSX |
| **OSDK / auth** | `client`, auth callback, provider wiring | Feature UI |

Suggested shape (names flexible; layers are not):

```
src/
  screens/          # route-level only
  components/       # reusable UI
  hooks/            # reusable hooks (OSDK + UI state)
  utils/            # pure functions
  # plus domain folders as needed (workspace, lenses, dispatch, auth, osdk)
```

**Rules**

1. **Screens for routing** — `react-router-dom` route `element`s point at screen modules. Screens compose components + hooks.
2. **Reusable components** — extract shared UI; props in, events out.
3. **Reusable hooks** — wrap `useOsdkObjects` / `useOsdkAction` / selection state once; reuse across lenses.
4. **Utils for logic** — staleness thresholds, sort/compare, parts-path classification → pure functions in `utils/`.
5. **No god files** — if a screen grows query + guard + layout + dialog, split layers.

### Component structure (with no-use-effect)

```tsx
export function FeatureScreen({ id }: Props) {
  // Hooks first (OSDK + local state)
  const { data, isLoading, error } = useFeature(id);
  const [open, setOpen] = useState(false);

  // Derived values — NOT useEffect + setState
  const label = data?.name ?? "Unknown";

  // Event handlers
  const onConfirm = () => { /* applyAction in handler */ };

  if (isLoading && !data) return <Loading />;
  if (error) return <ErrorView error={error} />;

  return <FeatureView label={label} open={open} onConfirm={onConfirm} />;
}
```

## Vite 8 essentials

Docs: [vite.dev/guide](https://vite.dev/guide/), [migration](https://vite.dev/guide/migration).

| Topic | Guidance |
| --- | --- |
| Node | **20.19+** or **22.12+** |
| Bundler | **Rolldown** (dev + prod). Prefer `build.rolldownOptions` / `optimizeDeps.rolldownOptions` over deprecated Rollup/esbuild options |
| Transforms | **Oxc** — migrate `esbuild` config → `oxc` when touching config |
| CSS minify | Lightning CSS by default |
| Entry | Root `index.html` is the app entry (not under `public/`) |
| Env | Client env via `import.meta.env` (`VITE_*`). Do not invent SSR patterns |
| Alias | Keep `@` → `./src` |
| Dev port | Project uses **8080** (OAuth redirect). Preserve unless intentionally changing Foundry redirect URLs |
| Scripts | `dev` → `vite`; `build` → `tsc && vite build`; `preview` → `vite preview` |

### Required Vite + OSDK define

OSDK libraries still read `process.env.NODE_ENV`. Without this, runtime fails with `process is not defined`:

```ts
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: 8080 },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
}));
```

See [Using OSDK with Vite](https://palantir.github.io/osdk-ts/guides/vite).

### Env & secrets

- Config via HTML meta tags / `.env*` as already scaffolded — never commit `FOUNDRY_TOKEN`, client secrets, or enrollment URLs.
- Use `import.meta.env.BASE_URL` for router `basename` (already in `router.tsx`).
- Production build is a static SPA for Foundry hosting (`foundry.config.json` → `./dist`).

### Vite 7 → 8 (when upgrading this repo)

1. Optional intermediate: `rolldown-vite` on Vite 7, then `vite@^8`.
2. Replace `build.rollupOptions` → `build.rolldownOptions`.
3. Replace `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions`; `esbuild` → `oxc`.
4. Retest OAuth callback, OSDK queries, and production `preview` / Foundry deploy.
5. Watch CJS default-import breakage; prefer fixing imports over `legacy.inconsistentCjsInterop`.

## Routing

- Screens only as route targets; nested UI stays in `components/`.
- Keep `/auth/callback` for OAuth.
- Path A product: one Command Center workspace — avoid inventing extra apps/routes without product need.
- Share selection state across lenses (temporal / investigative / compare); do not remount the whole tree in a way that drops focus.

## Product constraints (from PRD)

- Path A: temporal queue + investigative context + compare + confirm — **no map UI**.
- Writes only via governed actions (e.g. `ConfirmDispatch`) after human confirm — never silent assign.
- Surface parts honesty (truck / hub / unavailable) and staleness; concurrency errors must be visible.
- Viewer role: read-only; confirm disabled.

## Agent checklist

When implementing a feature:

1. Place route glue in a **screen**; extract reusable UI / hooks / utils.
2. Load/mutate Ontology only via **OSDK skill** patterns (`@osdk/react`).
3. Apply **no-use-effect** — derive, handle events, or `useMountEffect` for rare mount sync.
4. Add concise why-comments; keep types from generated SDK.
5. Verify: `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` when touching Vite config.
