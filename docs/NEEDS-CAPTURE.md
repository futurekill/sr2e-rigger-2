# Entries needing a high-res capture

Values that couldn't be read confidently off the scanned PDF and were left as a
placeholder or best guess. When a physical-book capture is available, fix these
and remove them from the list.

Format: **pack / item — field** — what's wrong, what was used as a placeholder.

## Open

- **r2-vehicle-weapons / Outlaw Missile (Block II) — cost** — book p.93 missile
  table; the cost cell is illegible in the scan. Placeholder: `0` (noted in item).
- **r2-cyberware / Snake-Eyes FDDM Link — Street Index** — book p.96 cyberware
  table; the SI cell is illegible in the scan. Placeholder: blank.
- **r2-cyberware / Cyberlimb Signal Booster — Essence** — the Essence cell reads
  "—" in the table; interpreted as "no separate Essence (uses the cyberlimb's
  capacity)" → stored 0. Confirm that reading.

## Resolved

- **r2-vehicle-weapons — ranges** — Weapon Ranges Table read off book p.107
  (PDF p.116). Real brackets applied: Victory/Vigilant Autocannons 100/500/
  2,500/5,000 m; Zapper 70/250/750/2,000 m; Jabberwocky 750/2,000/3,500/
  11,000 m. The table lists only these; miniguns keep a generic heavy preset
  (no R2-specific row) and guided missiles/mines stay at 0 (range set by
  guidance, not a bracket).
