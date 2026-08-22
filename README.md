# Dispatch Command Center

One screen for the person who sends techs to urgent refrigeration jobs around Chicago. Pick the job that is running out of time, see what part the system thinks is needed, compare two techs honestly, then assign or put the job on hold. Every choice is logged.

This is an open source demo built on Palantir Foundry. It shows how a real dispatch desk could work when work orders, parts, trucks, and the warehouse all live in one place instead of four different tools.

> **Note:** Inspired by public field service stories (including Parts Town’s AIP conference narrative). This is a learning project with fake data. It's not affiliated with or endorsed by Parts Town or any customer.

---



## The problem

On a busy Friday, a dispatch coordinator in the Midwest might have a dozen open cooler and walk in jobs. Each job has a deadline. Each job needs the right part on the right truck.

Today that person often jumps between:

- A work order list in one system
- A parts prediction tool in another
- Warehouse stock in a third
- Truck inventory that may be hours old

When tools are scattered and not communicated , mistakes will happen, crisis would look like :
- Double assignment on a technician 
- Truck rollout with the incorrect part 
- False signals ( customer are told help is coming but it's actually not ) 

This app will be modeled on top of that . 


---



## The solution

What The Dispatch Command Center offers :
- Puts the urgent queue, a map of Chicagoland, and the job details on one page. 
- No auto assign, every decisions has to be based on concrete evidence from real ,presented data. 

Foundry is our source of truth:
- Sites, equipment, predictions, truck stock, hub stock, and a record of every decision. 
- The client-side app reads data through Palantir OSDK and writes back only when the coordinator confirms.

This solution is modeled on what I imagine how teams at Palantir would embedded in a business and solve a specific issue , bring the problem onto Foundry to solve it.

---



## What you can do in the app

- **See open urgent jobs** sorted by how soon the deadline hits
- **Click a job in the list or on the map** and load site, equipment, and part guesses in one place
- **Compare up to two techs side by side** with a clear green, yellow, or red read on parts (on the truck, hub only, or not available)
- **See when data is old** (for example, truck inventory from three hours ago or a tech location from four hours ago) so nobody promises what they cannot deliver
- **Assign a tech** through a confirm step that checks parts, confidence, and stale signals
- **Hold a job for a hub parts pull** when nothing is available on a truck
- **Watch recent team decisions** in a slim footer strip (assignments and holds)
- **Use the map for context** where jobs and techs are, without assigning from the map itself

Demo scenarios baked into the seed data include a green assign path (`WO-003`), hub only yellow path (`WO-008`), red unavailable path (`WO-021`), low prediction confidence (`WO-014`), and stale truck or location rows. See [seed-data/README.md](./seed-data/README.md).

---



## How the screen is laid out

- **Left:** open job queue
- **Center top:** Chicagoland map (always visible)
- **Bottom row:** operations panel (job card, tech list, assign and hold) and compare panel (when two techs are checked)
- **Footer:** recent dispatch decisions

---

## Ontology Model 

- **Object types**: 
| Object type          | Key properties                                                                                                                                       | Notes                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `WorkOrder`          | `workOrderId`, `status`, `priority`, `slaDeadline`, `symptom`, `equipmentCategory`, `region`                                                         | Filter: urgent + commercial_refrigeration |
| `CustomerSite`       | `siteId`, `name`, `city`, `zip`, `latitude`, `longitude`                                                                                             | Lat/lng drives map pins                   |
| `Equipment`          | `equipmentId`, `model`, `serialNumber`, `category`                                                                                                   | Linked to work order                      |
| `Technician`         | `technicianId`, `name`, `employmentType`, `skillTags`, `maxDailyJobs`, `homeHub`, `lastKnownLatitude`, `lastKnownLongitude`, `locationAsOfTimestamp` | Map and compare show location age         |
| `PartSku`            | `skuId`, `description`, `oemPartNumber`                                                                                                              | Parts catalog                             |
| `PartPrediction`     | `predictionId`, `confidence`, `rank`                                                                                                                 | From simulated PartPredictor feed         |
| `TruckInventory`     | `quantity`, `asOfTimestamp`                                                                                                                          | Staleness is required                     |
| `HubInventory`       | `quantity`, `hubId`, `asOfTimestamp`                                                                                                                 | Chicago hub stock                         |
| `DispatchAssignment` | `status`, `assignedAt`, `assignedBy`                                                                                                                 | Pending or confirmed                      |
| `DispatchDecision`   | `decisionType`, `reason`, `timestamp`, `actor`                                                                                                       | Audit log and activity feed               |

- **Cardinality**: 

```
WorkOrder       → CustomerSite        (many to one)
WorkOrder       → Equipment           (many to one)
WorkOrder       → PartPrediction      (one to many, ranked)
PartPrediction  → PartSku             (many to one)
Technician      → TruckInventory      (one to many)
HubInventory    → PartSku             (many to one)
WorkOrder       → DispatchAssignment  (one to one active)
DispatchAssignment → Technician       (many to one)
DispatchDecision   → WorkOrder        (many to one)
```


## Tech stack


| Layer       | What                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **App**     | React with Vite                                                                              |
| **Foundry** | Palantir OSDK (`@osdk/client`, `@osdk/react`, `@osdk/oauth`) and generated SDK `@dispatch-command-board/sdk` |
| **Auth**    | OAuth through Foundry (login on first load)                                                                  |
| **Map**     | Leaflet + react-leaflet, CARTO map tiles                                                                     |


This is a SPA . Deploy your own version on Foundry web hosting or any static host with the right env vars.

---



## Seed data

All demo numbers are synthetic CSV files in `[seed-data/](./seed-data/)`. Upload them into Foundry object types in dependency order (sites and SKUs first, then techs, equipment, work orders, inventory, assignments, decisions). Full upload order and row counts are in [seed-data/README.md](./seed-data/README.md).

After you test assign or hold actions, ontology state changes. Re-upload the CSVs or refresh your pipeline to reset the demo.

---




## State management

There is no global Redux or Zustand store in this repo. State is kept simple on purpose:

- **Shared UI selection** (focused job, compare checkboxes, assign target) lives in React Context: `WorkspaceSelectionProvider` in `src/workspace/WorkspaceSelectionProvider.tsx`. Queue, map, operations, and compare panels all read the same values.
- **Foundry data** (work orders, techs, inventory, decisions) comes from OSDK React hooks such as `useOsdkObjects`, `useOsdkObject`, `useLinks`, and `useOsdkAction`. When you assign or hold, the hooks refetch and the queue and map update from the ontology.
- **Dialog form state** (confirm notes, hold note, job details expanded) stays local inside each panel component.

---



## Clone and run locally

You need a Foundry enrollment, an ontology backed by the seed CSVs, and a client application registered in Developer Console.

### 1. Clone and install

```bash
git clone https://github.com/YOUR_ORG/dispatch-cmd-center.git
cd dispatch-cmd-center
npm install
```



### 2. Configure Foundry connection

Create a `.env.development` file in the project root (this file is gitignored):

```bash
VITE_FOUNDRY_API_URL=https://YOUR_ENROLLMENT.palantirfoundry.com
VITE_FOUNDRY_CLIENT_ID=your_client_id
VITE_FOUNDRY_REDIRECT_URL=http://localhost:8080/auth/callback
VITE_FOUNDRY_ONTOLOGY_RID=ri.ontology.main.ontology.YOUR_ONTOLOGY_RID
```

Match the redirect URL to what you set in Foundry Developer Console. Generate and publish the OSDK package (`@dispatch-command-board/sdk`) from your ontology, then ensure the version in `package.json` resolves for your registry.

### 3. Load seed data

Follow [seed-data/README.md](./seed-data/README.md) to upload CSVs and wire link types in Ontology Manager.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). Sign in with Foundry when prompted.

### Other scripts

```bash
npm run build      # production build
npm run preview    # preview production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run test       # Vitest (env tests skipped unless VERIFY_ENV_PRODUCTION=true)
```

---



## Data freshness

- Assign and hold **persist** in Foundry. Reloading the page shows current ontology state.
- SLA countdowns are computed in the browser from each job’s deadline field.
- Seed timestamps are anchored to `2026-07-29T18:00:00-05:00`. Without a refresh, open jobs eventually look breached and inventory looks stale.
- Set up a Foundry **Pipeline** plus **Build Schedules** to shift time columns forward on a cadence so the queue stays demo-ready. Step-by-step: [seed-data/README.md](./seed-data/README.md#keep-timestamps-fresh-foundry-build-schedule).

---



## License and disclaimer

Synthetic data only. Use this repo to learn Foundry + OSDK patterns for dispatch workflows. Replace placeholder GitHub URL and env values with your own before sharing.This app will be modeled on top of that . 


---



## The solution

What The Dispatch Command Center offers :
- Puts the urgent queue, a map of Chicagoland, and the job details on one page. 
- No auto assign, every decisions has to be based on concrete evidence from real ,presented data. 

Foundry is our source of truth:
- Sites, equipment, predictions, truck stock, hub stock, and a record of every decision. 
- The client-side app reads data through Palantir OSDK and writes back only when the coordinator confirms.

This solution is modeled on what I imagine how teams at Palantir would embedded in a business and solve a specific issue , bring the problem onto Foundry to solve it.

---



## What you can do in the app

- **See open urgent jobs** sorted by how soon the deadline hits
- **Click a job in the list or on the map** and load site, equipment, and part guesses in one place
- **Compare up to two techs side by side** with a clear green, yellow, or red read on parts (on the truck, hub only, or not available)
- **See when data is old** (for example, truck inventory from three hours ago or a tech location from four hours ago) so nobody promises what they cannot deliver
- **Assign a tech** through a confirm step that checks parts, confidence, and stale signals
- **Hold a job for a hub parts pull** when nothing is available on a truck
- **Watch recent team decisions** in a slim footer strip (assignments and holds)
- **Use the map for context** where jobs and techs are, without assigning from the map itself

Demo scenarios baked into the seed data include a green assign path (`WO-003`), hub only yellow path (`WO-008`), red unavailable path (`WO-021`), low prediction confidence (`WO-014`), and stale truck or location rows. See [seed-data/README.md](./seed-data/README.md).

---



## How the screen is laid out

- **Left:** open job queue
- **Center top:** Chicagoland map (always visible)
- **Bottom row:** operations panel (job card, tech list, assign and hold) and compare panel (when two techs are checked)
- **Footer:** recent dispatch decisions

More wireframes and click paths: [docs/UX-flow.md](./docs/UX-flow.md). Rules and ontology detail: [docs/PRD-Draft.md](./docs/PRD-Draft.md).

---



## Tech foundations


| Layer       | What we use                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **App**     | React 18, TypeScript, Vite 7                                                                                 |
| **Foundry** | Palantir OSDK (`@osdk/client`, `@osdk/react`, `@osdk/oauth`) and generated SDK `@dispatch-command-board/sdk` |
| **Auth**    | OAuth through Foundry (login on first load)                                                                  |
| **Map**     | Leaflet + react-leaflet, CARTO map tiles                                                                     |
| **Dates**   | date-fns                                                                                                     |
| **Routing** | react-router-dom (single main screen + auth callback)                                                        |


The app is a static single page app. It is meant to deploy on Foundry web hosting or any static host with the right env vars.

---



## Seed data

All demo numbers are synthetic CSV files in `[seed-data/](./seed-data/)`. Upload them into Foundry object types in dependency order (sites and SKUs first, then techs, equipment, work orders, inventory, assignments, decisions). Full upload order and row counts are in [seed-data/README.md](./seed-data/README.md).

After you test assign or hold actions, ontology state changes. Re-upload the CSVs or refresh your pipeline to reset the demo.

---



## UI libraries

- **Tailwind CSS 4** for layout and styling
- **shadcn/ui** style components (Button, Dialog, Checkbox, ScrollArea, and others under `src/components/ui/`)
- **Lucide** icons
- **next-themes** for light and dark mode
- **Self hosted fonts** in `public/fonts/` (Google Sans Flex for body text, Stack Sans Headline for headings). Paths and `@font-face` rules live in `src/constants/font.ts`.

---



## State management

There is no global Redux or Zustand store in this repo. State is kept simple on purpose:

- **Shared UI selection** (focused job, compare checkboxes, assign target) lives in React Context: `WorkspaceSelectionProvider` in `src/workspace/WorkspaceSelectionProvider.tsx`. Queue, map, operations, and compare panels all read the same values.
- **Foundry data** (work orders, techs, inventory, decisions) comes from OSDK React hooks such as `useOsdkObjects`, `useOsdkObject`, `useLinks`, and `useOsdkAction`. When you assign or hold, the hooks refetch and the queue and map update from the ontology.
- **Dialog form state** (confirm notes, hold note, job details expanded) stays local inside each panel component.

---



## Clone and run locally

You need a Foundry enrollment, an ontology backed by the seed CSVs, and a client application registered in Developer Console.

### 1. Clone and install

```bash
git clone https://github.com/YOUR_ORG/dispatch-cmd-center.git
cd dispatch-cmd-center
npm install
```



### 2. Configure Foundry connection

Create a `.env.development` file in the project root (this file is gitignored):

```bash
VITE_FOUNDRY_API_URL=https://YOUR_ENROLLMENT.palantirfoundry.com
VITE_FOUNDRY_CLIENT_ID=your_client_id
VITE_FOUNDRY_REDIRECT_URL=http://localhost:8080/auth/callback
VITE_FOUNDRY_ONTOLOGY_RID=ri.ontology.main.ontology.YOUR_ONTOLOGY_RID
```

Match the redirect URL to what you set in Foundry Developer Console. Generate and publish the OSDK package (`@dispatch-command-board/sdk`) from your ontology, then ensure the version in `package.json` resolves for your registry.

### 3. Load seed data

Follow [seed-data/README.md](./seed-data/README.md) to upload CSVs and wire link types in Ontology Manager.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). Sign in with Foundry when prompted.

### Other scripts

```bash
npm run build      # production build
npm run preview    # preview production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run test       # Vitest (env tests skipped unless VERIFY_ENV_PRODUCTION=true)
```

---



## Data freshness

- Assign and hold **persist** in Foundry. Reloading the page shows current ontology state.
- SLA countdowns are computed in the browser from each job’s deadline field.
- Seed timestamps are anchored to `2026-07-29T18:00:00-05:00`. Without a refresh, open jobs eventually look breached and inventory looks stale.
- Set up a Foundry **Pipeline** plus **Build Schedules** to shift time columns forward on a cadence so the queue stays demo-ready. Step-by-step: [seed-data/README.md](./seed-data/README.md#keep-timestamps-fresh-foundry-build-schedule).

---



## License and disclaimer

Synthetic data only. Use this repo to learn Foundry + OSDK patterns for dispatch workflows. Replace placeholder GitHub URL and env values with your own before sharing.
