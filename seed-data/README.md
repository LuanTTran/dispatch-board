# Seed Data 

Synthetic CSV seed files for Foundry object backing. **No real customer data.**

**Demo anchor time:** `2026-07-29T18:00:00-05:00` (Friday evening rush)

## Object type & defined link types


1. `customer_sites.csv` → `CustomerSite`
2. `part_skus.csv` → `PartSku`
3. `technicians.csv` → `Technician`
4. `equipment.csv` → `Equipment`
5. `work_orders.csv` → `WorkOrder` (FK: `siteId`, `equipmentId`)
6. `part_predictions.csv` → `PartPrediction` (FK: `workOrderId`, `skuId`)
7. `truck_inventory.csv` → `TruckInventory` (FK: `technicianId`, `skuId`)
8. `hub_inventory.csv` → `HubInventory` (FK: `skuId`, `hubId`)
9. `dispatch_assignments.csv` → `DispatchAssignment` (FK: `workOrderId`, `technicianId`)
10. `dispatch_decisions.csv` → `DispatchDecision` (FK: `workOrderId`)



## File summary

| File | Rows | Primary key |
|------|------|-------------|
| `customer_sites.csv` | 18 | `siteId` |
| `part_skus.csv` | 40 | `skuId` |
| `technicians.csv` | 10 | `technicianId` |
| `equipment.csv` | 28 | `equipmentId` |
| `work_orders.csv` | 32 | `workOrderId` |
| `part_predictions.csv` | 94 | `predictionId` |
| `truck_inventory.csv` | 69 | `truckInventoryId` |
| `hub_inventory.csv` | 40 | `hubInventoryId` |
| `dispatch_assignments.csv` | 6 | `assignmentId` |
| `dispatch_decisions.csv` | 10 | `decisionId` |

## Demo edge cases 

| Case | Where to look |
|------|----------------|
| **Green path** — truck has part | `WO-003` → top prediction `SKU-002`; `Tech-07` truck qty 3 |
| **Yellow path** — hub only | `WO-008` → `SKU-006`; hub qty 8; `Tech-07` has **no** `SKU-006` on truck |
| **Red path** — unavailable | `WO-021` → `SKU-040`; hub qty 0; not on any truck |
| **Low confidence** | `WO-014` → rank-1 prediction confidence `0.40` |
| **Truck inventory staleness** | `Tech-03` → all truck rows `asOfTimestamp` = 3h ago |
| **Tech location staleness** | `Tech-05` → `locationAsOfTimestamp` = 4h ago |
| **Concurrency race target** | `Tech-07` unassigned + near `WO-002` / `WO-003`; no active assignment |
| **Activity feed seeds** | `dispatch_decisions.csv` ; recent entries for `WO-003`, `WO-021` |

## Column notes

- **`skillTags`** — semicolon-separated (e.g. `commercial_refrigeration;walk_in`)
- **`employmentType`** — `w2` or `partner`
- **`homeHub` / `hubId`** — `HUB-CHI` (Chicago central hub)
- **Timestamps** — ISO 8601 with offset (`-05:00`)
- **Foreign keys** in child datasets use string IDs matching parent primary keys

## Keep timestamps fresh (Foundry build schedule)

Seed CSVs are written against one fixed moment: **demo anchor time** `2026-07-29T18:00:00-05:00`. SLA deadlines, inventory `asOf` rows, and tech location times are all relative to that anchor.

If you leave the data as-is, all the timestamps will be stale, and Foundry won't be able to fetch and display real-time data to interact with.

to **Fix:** this , I added a Foundry **Pipeline** that rewrites time columns on a schedule, then wire it in the **Build Schedules** app so it rerun on demand, keep the timestamps fresh to interact with.

### What the pipeline should do

1. Read the raw seed datasets (unchanged CSVs in Foundry, or repo copies you upload to a staging dataset).
2. Compute a shift from the anchor to now:

   `shift = current_time − demo_anchor_time`

3. Add that shift to every timestamp column. Relative gaps stay the same:
   - `WO-003` still has ~21 minutes to SLA (not six months overdue).
   - `Tech-03` truck rows stay ~3 hours old (staleness demo intact).
   - `Tech-05` location stays ~4 hours old.
4. Write the shifted rows to the datasets that back your ontology object types.

### Columns to shift

| Dataset / object type | Column |
| --------------------- | ------ |
| `work_orders.csv` → `WorkOrder` | `slaDeadline` |
| `technicians.csv` → `Technician` | `locationAsOfTimestamp` |
| `truck_inventory.csv` → `TruckInventory` | `asOfTimestamp` |
| `hub_inventory.csv` → `HubInventory` | `asOfTimestamp` |
| `dispatch_assignments.csv` → `DispatchAssignment` | `assignedAt` |
| `dispatch_decisions.csv` → `DispatchDecision` | `timestamp` |

Do **not** shift static fields (IDs, quantities, symptoms, lat/lng). Only time columns move.

### Build schedule setup

In Foundry:

1. Author the pipeline in **Code Repositories** or **Pipeline Builder** (your choice for Developer Tier).
2. Open **Build Schedules** (platform app).
3. Create a schedule on the pipeline output datasets that feed object backing.
4. Pick a cadence that matches how you demo:
   - **Daily** for a shared enrollment that stays warm.
   - **Before interviews** as a manual or cron trigger if you prefer control.

After each successful build, reload the SPA. The queue should show open urgent jobs with believable SLA countdowns again.

**note**: If you're interested to clone this project, you can use `AI FDE` feature to help you build the pipeline schedule.


### Reset after `ConfirmDispatch` testing

Action writeback changes work order status, assignments, and audit rows. Timestamp refresh alone does not undo those edits.

To fully reset the demo:

- Re-upload CSVs and re-run the shift pipeline, or
- Point the pipeline at pristine seed inputs every run so each build restores both **time** and **baseline rows** (recommended for a repeatable demo enrollment)

