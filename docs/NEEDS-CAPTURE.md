# Entries needing a high-res capture

Values that couldn't be read confidently off the scanned PDF and were left as a
placeholder or best guess. When a physical-book capture is available, fix these
and remove them from the list.

Format: **pack / item — field** — what's wrong, what was used as a placeholder.

## Open

- **Design engine / Chassis Table (p.170–171) & Power Plant Table (p.168–169)**
  — the dense design-data tables. Bikes + cars (to Heavy Transport) transcribed
  reliably from the scan and cross-checked (Sand Buggy 20 DP, Sports Car 110 DP
  confirmed), but the lower-density rows read inconsistently between dpi passes
  (e.g. Tractor DP 175 vs 750; ATV DP shows an improbable 445). These Design-
  Point values drive every designed vehicle's cost, so the **transports/APCs/
  crawlers/RPV, all aircraft chassis (p.171), and the entire Power Plant Table
  (p.168–169)** need **clean straight-on photos** before transcription — same as
  the missile/cyberware captures. Captured so far in `tools/data/chassis.json`.
- **r2-vehicle-mods / Electronic Counter-Countermeasures (ECCM) — per-level
  cost** — the p.138 capture (IMG_6426) was at a steep angle, so the **cost**
  column sits on the page curve and still isn't legible. Availability/Street
  Index ARE now confirmed (4/7 SI 2, 4/10 SI 2.5, 5/14 SI 3, 6/21 SI 3.5, then
  8/30, 10/45, 12/60, 14/3 mo, 16/6 mo, 18/1 yr; SI — for L5+). Still need a
  **straight-on reshoot of just the ECCM cost column** to fix L1–L4. Placeholder
  L1 cost stays 10,000¥.

## Resolved

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
