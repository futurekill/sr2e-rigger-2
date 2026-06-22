# Vehicle Design-from-Scratch Engine — Spec & Plan

Implements *Rigger 2*'s Vehicle Design rules (book p.108–123) as a working
point-buy builder in Foundry. The **engine** (data-model fields, calculator,
UI) is **system-side** (`sr2e-foundryvtt`); the **data** (chassis, power plants,
mod Design-Point costs) is **module content** (`sr2e-rigger-2`). System provides
the capability, the module provides the catalog — same split as the qualities.

Status: **scoped**. Data located and validated; no code yet.

---

## The design system (how the book works)

Six steps; final price = **total Design Point Value × Mark-Up Factor**.

1. **Select a chassis** — Chassis Table (book **p.170–171**). Sets starting
   Handling, Body (fixed), Armor, Cargo (start CF + max CF), Autonav/Pilot,
   Sensor, seating, entry points, setup/breakdown, landing/takeoff profile, and
   a base **Design Point** value. Ratings other than Body may be improved (or
   freely downgraded — downgrades don't reduce DP/cost).
2. **Select a power plant** — Power Plant Table (book **p.168–169**), keyed by
   power-plant type × chassis. Sets Speed/Accel/Load (starting + max), Signature,
   Economy (start+max), Fuel size, and a **Design Point** value. Speed & Load
   start at the minimum; raise them via design options.
3. **Add design options** — increases to ratings, each costing Design Points
   (no nuyen during design). Within power-plant ranges; per-point DP costs come
   from the power plant (examples: sports-car engine 2 DP per Speed point /
   2 per Accel point; buggy engine ~25 DP/point). **Engine Customization**
   (p.120) raises a rating *above* the power-plant max: each level adds Speed +30
   OR Accel +5 OR Load +(Body×50); Design Cost = power-plant DP × 1.25 (first
   level), +0.5 to the multiplier per extra level; max = power-plant max × 1.75.
4. **Add vehicle modifications** — the Vehicle Customization catalog (book
   **p.118–146**). During design, use each mod's **Design Cost** (in Design
   Points), NOT its nuyen Parts Cost. CF Consumed / Load Reduction subtract from
   the vehicle's Cargo / Load.
5. **Add accessories** — same catalog, also Design-Point-priced.
6. **Determine cost** — `Design Point Value × Mark-Up Factor` (the Mark-Up
   Factor rises as ratings approach/exceed maxima; **table location TBD —
   still to capture**, see Open items).

### Validated reference points (use as test cases)
- Sand Buggy chassis = **20 DP** (Handling 4, Body 3, Armor 0, CF 4/max 15). ✓
- Sports Car chassis = **110 DP** (Handling 4/8, Body 3, CF 3/max 18). ✓
- Rich's Sports Car build: 110 + power plant, Accel +11 (×2 = 22 DP), Speed +151
  (×2 = 302 DP) → 599 DP, then mods → **659 DP** final. (Worked example, p.112–113.)

---

## Architecture

### Layer 1 — Data
- **System** gains two item types: `vehicle_chassis` and `vehicle_powerplant`
  (each a record of the table row: stats + DP value; power plant also lists
  compatible chassis + per-point DP costs + ranges). Drag a chassis + power
  plant onto a vehicle like mods.
- **Structure the mod Design-Point cost** on `VehicleModData`: add
  `designPoints` / `designPointsPerRating` / `cfCost` / `loadCost` / `statEffect`
  so the calculator reads them instead of the free-text `notes`. (The 58 mods +
  the p.118–123 ones below need this promotion.)
- **Module** ships the chassis/power-plant rows as compendium packs
  (`r2-chassis`, `r2-powerplants`) and the structured mods.

### Layer 2 — Calculator (pure, unit-tested)
`vehicleDesign({ chassis, powerPlant, options, mods })` in
`module/rules/sr2e-rules.mjs` (no Foundry deps) →
`{ handling, speed, accel, body, armor, sig, cfUsed, loadUsed, designPoints,
markUp, cost, overBudget }`. Validates CF/Load budgets and rating maxima.
Unit-test against the reference points above (assert DP totals, cite the page).

### Layer 3 — UI
A "Design" tab on the vehicle sheet: pick chassis + power plant, add mods with
ratings, live readout of stats / Design Points / cost / CF & Load budget with
overflow warnings; a **Finalize** button snapshots the computed stats to plain
stored fields so a finished vehicle behaves like the existing compendium ones.

---

## Phased plan

- **Phase 0a — content gap.** ✅ **DONE.** Added the 8 missed engine/early mods
  (p.118–123) to `r2-vehicle-mods` (now 66, full catalog p.118–146): Structural
  Agility, Engine Customization, GridLink Power, Nitrous Oxide Injectors,
  SurCell Power, Turbocharging/Superconductive Drive, Adjusted Controls,
  Autonavigation System. The mod Design-Point costs live in their notes; Phase
  0b will promote them to structured fields. (The Vehicle Modifications index is
  on book p.119 — cross-checked.)
- **Phase 0b — design data.** 🔄 **IN PROGRESS.** Transcribe the **Chassis
  Table** (p.170–171) and **Power Plant Table** (p.168–169) into structured data
  (`tools/data/chassis.json` started: bikes + cars done & cross-verified). The
  dense lower rows + all aircraft + the whole power-plant grid read unreliably on
  the scan → **awaiting clean book photos** (see NEEDS-CAPTURE). Then promote mod
  Design-Point costs to structured fields; capture the **Mark-Up Factor** table;
  add the `vehicle_chassis` / `vehicle_powerplant` system item types + packs.
- **Phase 1 — calculator + tests.** ✅ **DONE.** `vehicleDesign()`,
  `engineCustomizationCost()`, and `DESIGN_OPTION_COSTS` in
  `module/rules/sr2e-rules.mjs`, with unit tests (npm test green, 81) asserting
  the book's worked examples end-to-end:
  - DP accumulation: Sand Buggy 20, Sports Car 110, Rich's build 599→659.
  - Flat per-point costs (p.115-117): Handling 25, Speed 2, Accel 2, Armor 50,
    Cargo 1/CF, Load 1/10 kg.
  - **Cost formula (p.115): `DP × Mark-Up × 100¥`** — verified against Rich's
    1,239-DP car at Mark-Up 2.5 = 309,750¥ and Steff's 154-DP Light Strike at
    Mark-Up 2 = 30,800¥.
  The engine's logic is complete and proven; it just needs the lookup DATA.

### Phase 0b — design data: ✅ ~95% done
- **`tools/data/chassis.json`** — ✅ COMPLETE: full Chassis Table, both pages
  (59 chassis: bikes/cars/hovercraft/boats/rotorcraft/fixed-wing/vector-thrust/
  special), from close book photos.
- **`tools/data/powerplants.json`** — ✅ 78 engine×chassis entries: electric,
  methane, gasoline, diesel, jet turbine, sail. **Only Jet Propeller (turboprop)
  remains** — its DP column was cut off the edge of the photo; needs one re-shot
  of p.169 with the right-hand DP column in frame.
- A handful of shadowed cells are flagged with `_note` for verification.

### Remaining
- Re-shot of the Jet Propeller DP column (p.169) → last engine.
- Wire `chassis.json` + `powerplants.json` into the system (config or a small
  loader) so `vehicleDesign()` can look them up.
- **Phase 2: the Design tab UI** on the vehicle sheet — best done as a dedicated
  session with live in-Foundry testing.
- **Phase 2 — Design tab UI** on the vehicle sheet + Finalize.

## Open items / to capture
- **Mark-Up Factor table** — referenced in the worked examples ("Mark-Up Factor
  increased by .5") but its full rule/table isn't yet located. Find before
  Phase 1 cost output is meaningful.
- Per-point Speed/Accel/Load DP costs: confirm whether they live in the Power
  Plant Table cells or are a flat rule; the examples imply they're power-plant-
  specific.
- Generic Handling/Armor/Body/Cargo improvement DP costs (p.114–117) — confirm
  exact per-point figures during Phase 0b.

Rendered source pages are in `_work/pages/` (git-ignored): chassis p.170–171
(pg-179–180), power plant p.168–169 (pg-177–178), design rules p.109–123
(pg-118–132).
