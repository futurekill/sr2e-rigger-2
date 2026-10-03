# Shadowrun 2E: Rigger 2

A Foundry VTT V13 module bringing *Rigger 2* (FASA 7906) to the [Shadowrun 2nd Edition system](https://github.com/futurekill/sr2e-foundryvtt) (`sr2e`). Vehicles and drones, vehicle modifications, vehicle weapons, rigger cyberware and electronics, edges and flaws, and the Mechanic contact.

## Contents

| Pack | Contents |
|---|---|
| R2 Vehicles & Drones | 21 actors |
| R2 Vehicle Mods | 66 items |
| R2 Vehicle Weapons | 16 items |
| R2 Rigger Cyberware | 10 items |
| R2 Rigger Electronics | 14 items |
| R2 Edges & Flaws | 5 items |
| R2 Contacts | 1 items |

## Notes

- **Vehicle design from scratch** (Rigger 2 p.108–123): the system ships the vehicle sheet's Design tab and its point-buy math; this module registers the Chassis and Power Plant tables (59 chassis, 86 power plants) into it when enabled. See `docs/DESIGN-ENGINE.md`.
- `npm run sync-design-data` copies `tools/data/` to the shipped `data/` folder after editing the tables.

## Requirements

- Foundry VTT V13
- The `sr2e` system, version 0.10.0 or later

## Installation

In Foundry, **Add-on Modules → Install Module**, and paste this manifest URL:

```
https://github.com/futurekill/sr2e-rigger-2/releases/latest/download/module.json
```

Then enable it in your world (**Game Settings → Manage Modules**).

## Development

`packs-src/` (one JSON file per document) is the source of truth. `packs/` is built from it, gitignored, and rebuilt by the release workflow.

```bash
npm install
npm run build-packs     # packs-src/ JSON -> packs/ LevelDB (close Foundry first)
npm run extract-packs   # pull edits made in Foundry back to packs-src/
npm run validate        # pre-flight checks on the pack sources
npm run lint
```

To release: add a `## X.Y.Z — date` section to `CHANGELOG.md` (the release notes come from it), bump `module.json`, then tag and push `vX.Y.Z`.

## Copyright

*Rigger 2* and *Shadowrun* are © FASA and their rights holders. This is a fan-made, non-commercial module for personal table use by owners of the book.
