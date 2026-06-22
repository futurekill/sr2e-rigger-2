# Entries needing a high-res capture

Values that couldn't be read confidently off the scanned PDF and were left as a
placeholder or best guess. When a physical-book capture is available, fix these
and remove them from the list.

Format: **pack / item — field** — what's wrong, what was used as a placeholder.

## Open

- **Design engine — STILL NEED: Mark-Up Factor.** Photos of the Chassis Table
  (IMG_6429/6431) and the Power Plant Table (IMG_6432/6433) all arrived:
  - ✅ **Chassis p.170** (bikes/cars/hovercraft/boats) fully transcribed in
    `tools/data/chassis.json`; resolved the scan ambiguities (Tractor = 175 DP,
    not 750). Two minor DP cells unread (Skimmer Large, Sport Cruiser) — flagged.
  - 🔄 **Chassis p.171** (rotor/fixed-wing/vector-thrust/special) captured;
    transcription pending (rotor-craft drone names need a closer read).
  - 🔄 **Power Plant Table (p.168–169)** captured (IMG_6432/6433); transcription
    pending.
  - ❌ **Mark-Up Factor** rule/table — still not located/captured; needed for the
    final-cost step.

## Resolved

- **r2-vehicle-mods / ECCM — per-level cost** — clean straight-on photo of p.138
  (IMG_6434) read the cost column: L1 10,000¥, L2 30,000¥, L3 100,000¥,
  L4 100,000¥, L5 150,000¥, L6 250,000¥, L7 750,000¥, L8 2.5M¥, L9 6M¥, L10 12M¥
  (L3/L4 both list 100,000¥ in the book). Applied to the ECCM mod's notes.
- **r2-vehicle-weapons / missiles — names & costs** — high-res p.93 capture
  (IMG_6423). Corrected: the launcher is **Man-Portable** (weight 8, SI 4, not
  "Non-Portable"/30); Outlaw variants are **Block I (ICM)** 15,000¥, **Block IA
  (DP-ICM)** 25,000¥, **Block II** 20D/35,000¥ (this resolves the old illegible
  "Block II cost"); and the light wt-17 missile is the **Vogeljäger** (14D,
  5,000¥), not a Block II Outlaw. AIM-11R confirmed (14D, 90, 25,000¥).
- **r2-cyberware / Snake-Eyes FDDM — Street Index & Essence** — p.96 capture
  (IMG_6424). It's the **Snake-Eyes FDDM Module**: Essence **0.1** (was wrongly
  1.0), Street Index **3**, 70,000¥, 10/21 days.
- **r2-cyberware / Cyberlimb Signal Booster — Essence** — p.96 capture confirms
  the Essence cell is literally "—": no separate Essence (uses the limb's
  capacity). Stored 0; note updated.
- **r2-vehicle-weapons — ranges** — Weapon Ranges Table read off book p.107
  (PDF p.116). Real brackets applied: Victory/Vigilant Autocannons 100/500/
  2,500/5,000 m; Zapper 70/250/750/2,000 m; Jabberwocky 750/2,000/3,500/
  11,000 m. The table lists only these; miniguns keep a generic heavy preset
  (no R2-specific row) and guided missiles/mines stay at 0 (range set by
  guidance, not a bracket).
