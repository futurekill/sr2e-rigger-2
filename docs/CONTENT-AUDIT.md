# Rigger 2 — Content Audit

A page-by-page check of *Rigger 2* (FASA 7906) against what's in the packs, so
"done with the book" is verified, not assumed. Walked the full table of contents
(book p.2–3) plus the item-bearing pages at 200dpi.

Legend: ✅ done · ❌ missing (transcribe) · 🚫 rules, not compendium content ·
⏸ deferred · ❓ open question.

---

## Rules chapters (book p.5–90) — 🚫 mechanics, not items
These are game rules (most already implemented in the SR2E system; the rest are
GM reference). Not compendium content.
- Introduction / A Night in the Life / Mission Improbable — fiction. 🚫
- The Rigger: Dice Pools, Vehicle Control Rig, Maintenance & Overhead. 🚫
- Standard Vehicle Operations, Vehicle Attributes, Stress, Repairing. 🚫
- Sensors (ratings, tests, ranges, ECM/ECD rules). 🚫
- Special Vehicle Operations (lifting/pulling, mechanical arms/legs, ACV,
  aircraft, monorails). 🚫
- Vehicle Combat (maneuver score, turn sequence, actions, damage, magic). 🚫
- Vehicle Gunnery, Drones, Electronic Warfare, The Duelists, The Security
  Rigger, Advanced Vehicle/Gunnery/Remote/EW Rules, Optempo, Quality Factors,
  Subsystem Damage. 🚫

**Item-adjacent exceptions in the rules chapters:**
- **New Edges and Flaws (p.15)** — ✅ done. Added a `quality` item type to the
  SR2E system (Edge/Flaw with a build-point value + an Edges & Flaws list on the
  character bio tab), then shipped the 5 Rigger-2-new qualities in `r2-qualities`:
  Computer Illiterate, Sensitive Neural Structure, Simsense Vertigo, Spike
  Resistance, Gremlins. (The others on p.14-15 — Adrenaline Surge, Bio-Rejection,
  Blind, Deaf, Night Vision/Blindness — are SR Companion qualities Rigger 2 only
  annotates for rigging; out of scope.)
- **The Mechanic (contact, p.19)** — a contact archetype. ❓ Could ship as a
  sample NPC actor; optional, low priority.

## New Toys (book p.91–107) — item content
- **Weapons (p.92–95)** — ✅ 16 in `r2-vehicle-weapons`.
- **Cyberware (p.96)** — ✅ 10 in `r2-cyberware`.
- **Remote Control Accessories (p.97–99):**
  - ✅ already in `r2-cyberware`/`r2-sensors`: cranial Remote Control Deck;
    BattleTac IVIS & FDDM **CRD** (cyber) master units; external encryption,
    decryption, ECCM, protocol-emulation modules; signal amplifier; storage
    memory. (The "Drone Modification for BattleTac IVIS/FDDM" = the two BattleTac
    **Receiver Modules** already in `r2-vehicle-mods`.)
  - ❌ **External Remote Control Deck** (gear: weight 3, 5,000¥ × Rating, 4/72 hrs, SI 3) — the carried counterpart of the cranial deck.
  - ❌ **BattleTac IVIS Master Unit (RC Deck)** (gear: weight 1, 75,000¥, 8/14 days, SI 3).
  - ❌ **BattleTac FDDM Master Unit (RC Deck)** (gear: weight 1, 125,000¥, 10/21 days, SI 3).
  - ❌ **Hitcher Jacks** (gear: weight 0, Rating × 100¥ per jack, 2/48 hrs, SI 3) — let passengers jack into the rigger's deck.
  - ❌ **Audio/Visual Screen Displays** (gear: weight 0.5, 100¥, 2/24 hrs, SI 1) — feed a drone's sensor view to non-jacked passengers.
  - ❌ **Intercom Speaker** (gear: weight 0, 25¥, 2/24 hrs, SI 1).
- **Autosofts (p.99–100):** expert systems adding their Rating to a drone's
  Pilot for one task. Book states only two exist:
  - ❌ **TAPS Sharpshooter Autosoft** (Gunnery).
  - ❌ **IPA ClearSight Autosoft** (Perception).
- **Drones and Robots (p.100–107)** — ✅ 21 in `r2-vehicles`.

## Vehicle Design & Customization (book p.108–146)
- **Customization modifications** — ✅ **66** in `r2-vehicle-mods` (book p.118–146,
  now complete). The catalog begins at p.118, not p.124 where transcription
  first started; the design-engine scoping caught the gap and the 8 missed
  engine/early mods were added (Phase 0a): Structural Agility, Engine
  Customization, GridLink Power, Nitrous Oxide Injectors, SurCell Power,
  Turbocharging/Superconductive Drive, Adjusted Controls, Autonavigation System.
  Cross-checked against the book's own Vehicle Modifications index (p.119).
- **Design-from-scratch tables** (chassis / power plant / design-point costs,
  p.108–123) — ⏸ **deferred**: these become structured data for the planned
  vehicle-design engine (see the design discussion), not standalone items.

## Vehicle List (book p.148–165) — ✅ resolved, no new content
Scanned at 200dpi: every `Reference: R2` entry re-lists a New Toys drone already
in `r2-vehicles`; all others reference other sourcebooks (RBII/CS/FF/NAGRL/SRII/
LS/Aztlan) and are out of scope.

---

## Gaps to transcribe (this audit's output)
**8 items, all in the New Toys Remote-Control-Accessories / Autosofts area:**
| # | Item | Pack | Type |
|---|---|---|---|
| 1 | External Remote Control Deck | `r2-sensors` | gear |
| 2 | BattleTac IVIS Master Unit (RC Deck) | `r2-sensors` | gear |
| 3 | BattleTac FDDM Master Unit (RC Deck) | `r2-sensors` | gear |
| 4 | Hitcher Jacks | `r2-sensors` | gear |
| 5 | Audio/Visual Screen Displays | `r2-sensors` | gear |
| 6 | Intercom Speaker | `r2-sensors` | gear |
| 7 | TAPS Sharpshooter Autosoft | `r2-sensors` (category autosoft) | gear |
| 8 | IPA ClearSight Autosoft | `r2-sensors` (category autosoft) | gear |

**Resolved since the audit:**
- ✅ New Edges and Flaws (p.15) — `quality` system type added + 5 in `r2-qualities`.
- ✅ The Mechanic (p.19) — shipped as a `contact` archetype template in `r2-contacts`.

The book's **item** content is now complete. The only remaining work is the
deferred **design-from-scratch** engine (chassis/power-plant tables + calculator
+ UI) and the **NEEDS-CAPTURE** values that need physical-book photos.
