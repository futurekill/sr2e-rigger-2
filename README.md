# Shadowrun 2E: Rigger 2

A FoundryVTT **content module** that adds material from *Rigger 2* (FASA 7906) —
vehicles & drones, vehicle modifications, vehicle weapons, rigger cyberware, and
sensors — as compendia for the [Shadowrun 2nd Edition system](../sr2e-foundryvtt)
(`sr2e`).

It **requires** the `sr2e` system (declared in `module.json`) and is enabled
per-world. Entirely separate from the system: its own repo, its own packs, no
shared code — it just builds content against the system's item/actor types.

## Status
Early scaffold. Content is transcribed from the source book into the `r2-*`
packs, batched by category — see `docs/RIGGER2-PLAN.md`.

## Development
`packs-src/` (per-document JSON) is the source of truth; `packs/` is the LevelDB
build (**committed** in this module). `npm run build-packs [name]` builds;
`npm run extract-packs` pulls Foundry edits back to JSON. Close Foundry before
rebuilding packs (LevelDB locks).

## Copyright
*Rigger 2* and *Shadowrun* are © FASA / their rights holders. This module is for
personal use at the owner's own table from a PDF they own, not for distribution.
The `_work/` directory (OCR + page renders of the source PDF) is local-only and
git-ignored.
