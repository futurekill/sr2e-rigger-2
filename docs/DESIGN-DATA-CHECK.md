# Design data: how it was checked

The vehicle builder's tables (`tools/data/design-chassis.json`, `design-powerplants.json`, `design-rules.json`) were
re-transcribed on 2026-11-07 for the vehicle-builder overhaul (system `docs/PLAN-vehicle-builder.md`, release 2).
They replace the old `chassis.json` / `powerplants.json` for the new design engine; the old files stay only for the
legacy Design tab until the Workshop replaces it.

## Method
1. Each table page rendered at 200 dpi (Rigger 2 PDF page = book page + 9), split into halves.
2. **First pass (Claude):** read every cell from the renders. The Power Plant Table is written as one line per printed
   row in `tools/transcribe/power-plants.py`, which generates the JSON; the Chassis Table is written directly.
3. **Second pass (Codex, independent):** given only the page images (not the files), it transcribed the same tables
   into the same columns.
4. A script compared the two passes cell by cell.

## Result
- **Chassis Table (p.170–171): 61 rows, every cell identical** (handling, body, armor, cargo start/max, autonav,
  pilot, sensor, seating, entry, setup, landing/takeoff, Design Points).
- **Power Plant Table (p.167–169): 92 rows, every cell identical** (speed with stall pairs, acceleration, load,
  signature, economy start/max and idle, fuel, Design Points), except one: the Vectored Thrust UAV's Design Points print
  as "30 + (15 x B" with the closing bracket missing; both read it as 30 + (15 × B).
- The page-170 skew (the right-hand columns print about half a row above their labels) was read the same way by both
  passes: e.g. Speedboat 110 DP, Sport Cruiser 125 DP, Yacht 200 DP with Living Amenities (Basic).

## Errors in the old data that this fixes (examples)
- Gasoline Sports Car Speed starts at **160** (old: 100); gasoline "Bikes, All Others" Acceleration **4/10** (old 10/40).
- Fixed Wing UAV (S) **710** DP (old 2,210); Rotary Wing UAV (S) **310** (old 510); Walker, Micro **265** (old 205);
  RPV **215** (old 350).
- Economy, idle rates, fuel size and the aircraft stall speeds were missing; every ×B row is now usable (Body comes
  from the chassis).

## Mappings decided here (the table's row labels → chassis)
- "Micro" UAV engines (electric, methane and gasoline fixed-wing; electric rotary) → the **Small** UAV chassis: the
  book's UAVs come only in small/medium/large, and small rotary UAVs are palm-sized (p.110).
- Electric "Body 0 Drone" → every Body-0 drone chassis (Crawler Micro, Walker Micro, Rotary Wing UAV (S)).
- "Tracked / Wheeled Drone" → the Small and Large crawlers and the RPV (each may be tracked or wheeled, p.109). Not the
  Micro crawler: with Body 0 those rows' ×Body maximum Load is 0, below their starting Load, and the table has its own
  "Body 0 Drone" row (found by running the engine over every pairing).
- "Walker(s)" → the three walkers and the Anthroform (a walker type, p.111).

## Printed values that look wrong (kept as printed; for the user)
- **Diesel Armored Personnel Carriers: Load 3 / 6 kg** (every other heavy vehicle is in thousands; likely 3,000 /
  6,000).
- **All-terrain Vehicle: 445 DP** (other bikes 10–30); confirmed against the user's book photo when first transcribed.
- **Limousine: max Cargo 250 CF** (Sedan 30, Pickup 42).
- Jet-propeller **Tilt-wing UAV (M/L): Signature blank**.

## Vehicle modifications (book p.118–146)
- Every entry's **Design Specifications** (Design Cost, Maximum, CF Consumed, Load Reduction) was transcribed twice:
  once by Codex from the page images (pages 118–146 in three batches), once by Claude reading every page; the two
  agreed on every design value. The one Codex slip: it marked anti-aircraft turrets customization-only, but p.134
  allows them in design at the turret's cost × 1.5 and +1 CF.
- They live in `tools/gen-vehicle-mods.mjs` → `DESIGN` (one entry per item, with its page), the single source of
  truth for the generated `r2-vehicle-mods` pack. 66 items became **99**: variants with their own design values are
  separate items (turret sizes, anti-aircraft and pop-up turrets, remote turrets, fixed-mount kinds, firearm kits,
  seats, ejection seats, sidecars, EnviroSeal options, Smartlink I/II, amphibious levels, adjusted controls, the
  anti-theft shock system). "SurCell" was a misreading of **SunCell** (p.121).
- **Build-relative costs are formulas** (system VehicleModData `dpFormula`/`cfFormula`/`loadFormula` over R B P C E K):
  Drive-by-Wire C × 1.75 × R, suspensions/control surfaces C × 1.25/1.40/1.50 × R, flotation C × 1.20, turbocharging
  E × 1.75 × R, Remote-Control Interface 25 × B, EnviroSeal B × 3/10/15/75, drone rack B × 12, hovercraft seals
  B × 5, mechanical arms B × 250, BattleTac P × 350 / 250, RAM R³ × 50, active thermal masking from the build's
  engine customization, armor Load B × B × 5 per point, baffles B × 50 per point, life support per 10 man-hours.
- **Customization only** (not in design): ablative armor, missile/rocket mounts, drop tanks, external cargo mounts;
  engine customization and structural agility are design OPTIONS instead. Special **tires** are paid in ¥ in design.
- **Weapon-mount points** (hardpoint 2, firmpoint 1, p.131) are recorded, so the engine holds them to the Body.

### Errors in the old mod data that this fixes (examples)
Secondary Controls 5 DP / 1 CF (old 35 DP); Crash Cage 10 kg (old 25); Gunnery Recoil Adjuster 0 kg (old 24+1/level);
Ablative Armor customization-only (old 50 DP/level); RAM R³ × 50 (old 50/level); ED level 3 CF 6 (old 4); ECD CF by
level 2–8 (old flat 1); anti-theft Rating 10 = 500 DP (old 100); Spotlight 6 DP (old 0); Datajack Port 10 kg and
Nitrous 1.5 CF / 15 kg (old none); ECM/ECCM/Sensors weights (old none).

### Read but kept as the book prints, with a note
- **Smart Armor System** Load: "Body × 50 kg per Armor Point" (SAS has no Armor Points of its own); counted once.
- **Folding Bench Seat**: no design Load printed; uses the standard bench seat's 150 kg.
