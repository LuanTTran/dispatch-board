# src

Application source for the Dispatch Command Center. This folder wires Foundry auth, routing, and the operator workspace together.

- `main.tsx` — App entry. Mounts React with theme, OSDK provider, and router.
- `client.ts` — Foundry OAuth client and shared OSDK client from HTML meta tags.
- `router.tsx` — Routes for the command center (`/`) and OAuth callback (`/auth/callback`).
- `index.css` — Global styles, layout shell rules, map marker styles, activity ticker.
- `vite-env.d.ts` — Vite type references.
- `env.test.ts` — Checks that production env vars are set and not placeholders.
