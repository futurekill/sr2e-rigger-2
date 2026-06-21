# Rigger 2 — Survey & Transcription Plan

Source: *Rigger 2* (FASA 7906), 186-page scanned PDF (no text layer → render +
OCR, verify numbers off the renders). This module covers the **content**; the
expanded rules are a separate, later track.

## Book structure (from the table of contents survey)

- **Rules, ≈ p.5–90** — the Rig & Control/Sub/VR Pools and the VCR in depth;
  Sensors & sensor ratings; Electronic Warfare (ECM/ECCM/deception); special
  vehicle ops; expanded Vehicle Combat (maneuvers, maneuver score, turn sequence,
  ramming, multi-vehicle); Drones & Robots; the Security Rigger; advanced build/
  EW rules; and the **Vehicle Design** system.
- **Content — "New Toys", ≈ p.91–115** — stat block + writeup each:
  vehicle weapons, rigger cyberware, new vehicles, drones, sensors/ECM.
- **Content — "Vehicle List", ≈ p.148–165** — a master catalog of vehicles &
  drones with full stats + a **source reference** per entry (reprints many
  core-book vehicles alongside Rigger-2-new ones).
  - **RESOLVED (scanned at 200dpi):** every `Reference: R2` entry in the list
    re-lists a New Toys drone already in `r2-vehicles` (Condor, Redball, Sentry
    II, Crawler, Hedgehog, Roto-Drone, Kodiak, Wolfhound, …); all other entries
    reference *other* sourcebooks (RBII, CS, FF, NAGRL, SRII, LS, Aztlan) and
    are **out of scope** for this module. The Vehicle List therefore needs **no
    new transcription**. (Reference field is NOT legible at 150dpi — the survey
    pass misread several; verified at 200dpi.)
- **Vehicle-design component tables** — chassis/accessory/mod costs scattered
  through the design chapters.

## Compendium packs (mapping to system data models)

| Pack | Type | Source sections |
|------|------|-----------------|
| `r2-vehicles` | Actor `vehicle` | New Toys vehicles + drones; Vehicle List (new only) |
| `r2-vehicle-mods` | Item `vehicle_mod` | vehicle-design component / accessory tables |
| `r2-vehicle-weapons` | Item `weapon` | New Toys vehicle weapons |
| `r2-cyberware` | Item `cyberware` | rigger cyberware (control remote deck, signal boosters…) |
| `r2-sensors` | Item `gear` | sensors / ECM gear |

## Batched transcription order (commit per batch)

1. New Toys → **vehicle weapons** (~10–15) — establishes the pipeline.
2. New Toys → **rigger cyberware** (handful).
3. New Toys → **sensors / ECM gear**.
4. New Toys → **new vehicles**.
5. New Toys → **drones**.
6. **Vehicle List** master catalog — the big batch; **Rigger-2-new entries only**
   (skip core-book reprints already in the system `vehicles` pack), using each
   entry's source reference to decide.
7. **Vehicle-design** component / mod tables → `r2-vehicle-mods`.

## Decisions (settled at kickoff)

- **Vehicle List scope:** transcribe Rigger-2-new vehicles only; skip core reprints.
- **Packs committed** (not gitignored) — always present, accept the churn.

## Discipline (same as the SSC build)

- Read the page render to verify every number; OCR is unreliable on stat tables.
- When a value is illegible/blank/uncertain, ask for a high-res physical-book
  capture instead of guessing; log open ones in `docs/NEEDS-CAPTURE.md`.
- Original/summarised descriptions only — no verbatim catalog/book prose.

## Scale

Multi-session: ~150+ vehicles/drones plus dozens of weapons / mods / sensors /
cyberware. Larger than the SSC, same method.

## Out of scope (separate rules track, if/when wanted)

Sensors + ratings, electronic warfare, maneuver-based vehicle combat (maneuver
score / turn sequence), and the vehicle-design system — these are mechanics that
would extend the system's vehicle model and add rolls/UI, not compendium content.
