# Rigger 2 Module — Development Notes

A FoundryVTT **V13** content module adding *Rigger 2* (FASA 7906) content to the
**Shadowrun 2nd Edition system** (`sr2e`). Separate package: own repo, own packs,
no shared code. Depends on the system via `module.json` → `relationships.systems`
(sr2e ≥ 0.10.0), so its items/actors use the system's data models (`vehicle`
Actor, `vehicle_mod`, `weapon`, `cyberware`, `gear`).

The sibling system repo is `../sr2e-foundryvtt`; the SSC module
(`../sr2e-street-samurai-catalog`) is the template this was scaffolded from.
Read the system `CLAUDE.md` for the data-model field contracts.

## Source material
The Rigger 2 PDF is a **scanned image** (186 pages, no text layer). Extraction
lives in `_work/` (git-ignored, never shipped): `_work/pages/pg-NN.png` (renders
via `pdftoppm -r 200`), OCR via `tesseract`. OCR mangles stat tables — **read the
page render to verify every number** before transcribing. When a value is
illegible/blank/uncertain, **stop and ask for a high-res capture of the physical
book** rather than guessing (track open ones in `docs/NEEDS-CAPTURE.md`).

## Packs are a build artifact (gitignored)
`packs/` (the built LevelDB) is **gitignored**. Foundry recompacts it every
session, so committing it churns the tree with meaningless diffs. `packs-src/` is
the source of truth; the release workflow rebuilds `packs/` from it, so installed
users always get built compendia.

**A fresh clone has no `packs/` — run `npm run build-packs` before pointing
Foundry at this folder, or the compendiums show up empty.** Likewise, after
editing `packs-src/` (or re-running a generator), rebuild before testing: Foundry
reads the LevelDB, not the JSON, and a stale build silently serves old data.
Close Foundry before rebuilding (LevelDB locks).

<!-- old note: 'accept the churn' — the churn is exactly why this changed. -->
Close Foundry before rebuilding
packs (LevelDB locks).

## Authoring conventions
- Content is **stat blocks** (game facts) transcribed into per-document JSON,
  with **original/summarised** descriptions — never paste verbatim flavour text.
- Build batched **by category**; a generator per category (`tools/gen-*.mjs`)
  keeps it repeatable. Commit each batch.
- Match the system data-model fields exactly (vehicle: handling/speed/accel/body/
  armor/signature/pilot/sensor/cargo/load/seating/cost/availability/autonav;
  vehicle_mod / weapon / cyberware / gear per their schemas).
- The back-of-book **Vehicle List** reprints many core-book vehicles (each has a
  source reference) — transcribe **Rigger-2-new** entries, skip core reprints
  already in the system's `vehicles` pack.

## Build workflow
`packs-src/` (per-document JSON) is the source of truth; `packs/` is the LevelDB
build (gitignored). `node tools/gen-<category>.mjs` emits JSON, then
`npm run build-packs [name]`. `npm run extract-packs` pulls Foundry edits back.

## Copyright
*Rigger 2* / *Shadowrun* are © FASA and rights holders. Personal table use only,
from a PDF the owner has; not for distribution. Keep `_work/` out of git; keep
the repo private.
