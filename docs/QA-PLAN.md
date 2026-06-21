# Rigger 2 — QA Plan

How to verify the `sr2e-rigger-2` content module before tagging a release. The
module ships **data only** (compendium packs of Items/Actors that use the `sr2e`
system's data models), so QA is mostly: *does it load clean, and does every
document open and behave like a normal system document?*

Run this with the **SR2E system** active and Foundry **V13**. Close Foundry
before any `npm run build-packs` (LevelDB locks).

---

## 0. Pre-flight (automated, no Foundry)

These catch the cheap mistakes before opening Foundry. Run from the repo root.

- [ ] **Packs build clean:** `npm run build-packs` exits 0 and reports the
      expected document count for every pack (see §1 table).
- [ ] **Sources are valid JSON:** `for f in packs-src/**/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f'))" || echo "BAD $f"; done`
      prints nothing.
- [ ] **Every doc has the required keys** (`_id`, `_key`, `name`, `type`,
      `system`) and `_key` matches `!items!<_id>` / `!actors!<_id>`. A quick
      node script over `packs-src/` is enough.
- [ ] **No duplicate `_id`s** within a pack.
- [ ] **`module.json` is well-formed** and lists all five packs; the
      `relationships.systems` entry requires `sr2e` (≥ the version whose data
      models these documents target).
- [ ] **NEEDS-CAPTURE is current:** every placeholder value still in the packs
      is listed in `docs/NEEDS-CAPTURE.md`, and nothing listed there has been
      silently "resolved" without fixing the data.

## 1. Load & smoke test (in Foundry)

- [ ] Enable the module in a world running the SR2E system. It loads with **no
      console errors** and **no "document failed schema validation"** warnings.
- [ ] All five compendiums appear and open. Document counts match:

  | Pack | Expected | Type |
  |---|---|---|
  | R2 Vehicles & Drones (`r2-vehicles`) | 21 | Actor (vehicle) |
  | R2 Vehicle Weapons (`r2-vehicle-weapons`) | 16 | Item (weapon) |
  | R2 Vehicle Mods (`r2-vehicle-mods`) | 38 | Item (vehicle_mod) |
  | R2 Cyberware (`r2-cyberware`) | 10 | Item (cyberware) |
  | R2 Sensors & ECM (`r2-sensors`) | 6 | Item (gear) |

  *(update counts as more content lands — they should equal the
  `wrote N …` line each `tools/gen-*.mjs` prints.)*

- [ ] Every document **opens its sheet** without error (the fastest way: select
      all in a pack, check none throw on render).

## 2. Per-pack functional checks

### r2-vehicles (drones)
- [ ] Drag **Aeroquip Redball Express** to the canvas → token appears; open the
      vehicle sheet → Handling 4 / Speed 300 / Accel 35 / Body 3 / Armor 0 /
      Sig 5 / Pilot 2 / Sensor 3 / cost 25,000¥.
- [ ] Spot-check a **Body 0** insect drone (Renraku Arachnoid / Shiawase
      Kanmushi): Body 0, Sig 16 — confirm the sheet tolerates Body 0 (these
      are destroyed by any hit; the notes say so).
- [ ] Spot-check the **Mesametric Kodiak** (Armor 12) — high armor renders.
- [ ] Confirm `notes` prose (fuel/economy/features) shows on the sheet.

### r2-vehicle-weapons
- [ ] Drag a mounted gun (e.g. **Ares Vigilant Autocannon**) onto a character →
      it lists under weapons, skill = **Gunnery**, firing modes parsed
      (SS/FA), damage 18D.
- [ ] **Ranges** populated for the three weapons from the p.107 table:
      Autocannons 100/500/2500/5000, Zapper 70/250/750/2000, Jabberwocky
      750/2000/3500/11000. Other weapons fall back to the heavy/0 preset.
- [ ] A missile (e.g. **AIM-11R**) shows ammo 1 / type missile.

### r2-vehicle-mods
- [ ] Open **Standard Vehicle Armor**, **Weapon Turret**, **ECM** → `modType`,
      `rating`, `cost` set; the **full pricing formula / size table** is in
      `notes` (these mods are formula-priced, so notes carry the real rule).
- [ ] **ECCM** carries the "scanned cost garbled" caveat in its notes (until the
      capture lands).

### r2-cyberware
- [ ] Drag **Remote Control Deck** onto a character → installs as cyberware,
      Essence cost applies to the character's Essence/derived stats.
- [ ] **Snake-Eyes FDDM Link** notes flag the missing Street Index.

### r2-sensors
- [ ] Drag **Remote Control Encryption Module (External)** onto a character →
      gear item, weight/cost present, category electronics.

## 3. Cross-checks vs the source

- [ ] For a random sample of ~5 documents per pack, re-open the book page cited
      in `notes` ("Rigger 2 p.NN") and confirm the numbers match. This is the
      real accuracy gate — the page renders are in `_work/pages/` (git-ignored).
- [ ] Confirm **no book flavour prose** was pasted verbatim — descriptions
      should be original one-liners (copyright discipline).

## 4. Regression / packaging

- [ ] `npm run extract-packs` round-trips (build → extract → `git diff` of
      `packs-src/` is empty except intended edits).
- [ ] The release workflow (`.github/workflows/release.yml`) builds packs and
      zips without the `_work/` renders or `node_modules`.
- [ ] After tagging, install the released zip in a clean world and re-run §1.

---

## Sign-off before tagging v0.1.0
- [ ] §0 and §1 fully green.
- [ ] §2 spot-checks pass for every pack.
- [ ] Remaining `NEEDS-CAPTURE` items are either fixed or knowingly accepted as
      placeholders for the release (and noted in the release notes).
