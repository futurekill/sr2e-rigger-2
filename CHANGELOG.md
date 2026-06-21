# Changelog

## 0.0.1 (in development)

- Scaffolded the `sr2e-rigger-2` content module: `module.json` requiring the
  `sr2e` system (≥ 0.9.0), packs for vehicles/drones, vehicle mods, vehicle
  weapons, rigger cyberware, and sensors; pack-build tooling; release workflow.
  Packs are committed (not gitignored). See `docs/RIGGER2-PLAN.md`.
### Vehicle weapons (`r2-vehicle-weapons`, 16)
- Mounted guns: Ares Vengeance & Vanquisher miniguns, Vigilant & Victory
  autocannons. Missile launcher + missiles: AIM-11R, Outlaw Block IA (ICM /
  DP-ICM), Block IB, Block II. Mines/rockets: Trapdoor smart mine, RASCAM,
  Zapper static-discharge rocket. Electronic-warfare munitions: Jabberwocky
  jammer rocket & missile, Silencer AARM. From the New Toys weapons tables
  (book p.92–95). Vehicle-mounted, so they use the Gunnery skill.

### Vehicle List scan (no new content) + Wolfhound fix
- Scanned the back-of-book Vehicle List (p.148–165) at 200dpi: every
  `Reference: R2` entry just re-lists a New Toys drone already in `r2-vehicles`;
  all other entries reference other sourcebooks (RBII/CS/FF/NAGRL/SRII/LS/Aztlan)
  and are out of scope. So the Vehicle List needs no new transcription — the 21
  New Toys vehicles are the complete R2-new set.
- Corrected the Wolfhound's manufacturer: "Aerospace Designs" → **Cyberspace
  Designs** (its writeup calls it the follow-up to the Dalmatian UAV); the New
  Toys heading was misread.

### Vehicles & drones (`r2-vehicles`, 21)
- New Toys "Drones and Robots" (book p.100–107): Aeroquip Redball Express
  resupply drone; Aerodesign Condor LDSD-23 & Condor II LDSD-41 recon drones;
  Ares Arms Sentry II weapons stand; Aztechnology Hedgehog signal-interceptor &
  GCR-23C Crawler; IWS DLK MK 6 Utility Machine + Armed Variant; Citroën
  Brouillard smoke generator; Aerospace Designs Wolfhound recon aircraft;
  FMC-Stonebrooke TADS Firebird & Salamander; GTE-Ford Retrans Unit; MCT-Nissan
  Roto-Drone; Mesametric Kodiak roadway-clearance vehicle; Renraku Arachnoid &
  Shiawase Kanmushi insect mini-drones; Pratt & Whitney Sundowner sprayer;
  Saab-Thyssen Bloodhound HAZMAT drone; Sikorsky-Bell Microskimmer II;
  Toyota MK-Guyver search-and-rescue robot. Back-of-book Vehicle List still to come.

### Vehicle-weapon ranges
- Applied the real range brackets from the Weapon Ranges Table (book p.107):
  Victory/Vigilant Autocannons, Zapper rocket, and Jabberwocky jammer rocket/
  missile. Resolves the ranges item in `docs/NEEDS-CAPTURE.md`.

### Vehicle modifications (`r2-vehicle-mods`, 58 — customization chapter complete)
- Finished the Accessories section (book p.144–146): Crane (+capacity table),
  Drone Rack, External Cargo Mount, Floatation Package, Hovercraft Water Seals,
  Mechanical Arms, Motorcycle Sidecar, Spotlight, Tires (5 types), Winch
  (+capacity table). This completes the entire Vehicle Design & Customization
  modifications chapter (p.124–146). Next: the back-of-book Vehicle List.
- Added electronics tail + accessories (book p.139–143): Electronic
  Counter-Deception (ECD), Electronics Port, Power Amplifier, Vehicle Sensor
  System (L1–10 table), Aircraft Drop Tanks, Amphibious Operation Package
  (L1–3), Anti-Theft System (rated, with shock/explosion options), Vehicle
  Seats (bench/bucket), Ejection Bucket Seat, Convertible Top.
- Added electronic-warfare systems (book p.137–138): Electronic Countermeasures
  (ECM), Electronic Counter-Countermeasures (ECCM), Electronic Deception (ED) —
  each a 1–10 (ED 1–6) leveled system with its full cost/weight table in notes.
  (ECCM's scanned low-level cost cells are garbled; flagged in NEEDS-CAPTURE.)
- Added weapon-mount & electronics mods (book p.134–136): Ring Mount, Smartlink
  Integration Kit, Weapon Turret (Mini/Small/Medium size table), Remote Weapon
  Turret, Vehicle Gyroscopic Stabilizer, BattleTac FDDM & IVIS Receiver Modules.
- Vehicle Customization modifications (book p.124–133). Control & handling:
  Contingency Maneuver Controls, Datajack Port, Drive-by-Wire System, Improved
  Control Surfaces (watercraft), Improved Suspension (ground), Off-Road
  Suspension, Remote-Control Interface, Remote Pilot Advanced Programming,
  Rigger Adaptation, Secondary Controls. Protective systems: Standard, Concealed
  & Ablative vehicle armor; Smart Armor System; Roll Bars; Advanced Passenger
  Protection System; Crash Cage; EnviroSeal; Life Support. Signature: Thermal
  Baffles, Active Thermal Masking, Radar-Absorbent Materials. Weapon mounts:
  Firearm Conversion Kit, Fixed Weapon Mount, Gunnery Recoil Adjuster,
  External/Internal Missile-Rocket Mounts, Pintle Mount. Many are formula-priced
  (× vehicle cost, per Armor Point/seat/level), so each item carries the full
  pricing rule in its notes. Remaining: turret/ring mounts and the rest of the
  customization chapter (p.134+), plus the Vehicle List.

### Edges & Flaws (`r2-qualities`, 5) — new pack
- The Rigger-2-new rigger qualities (book p.15): Computer Illiterate, Sensitive
  Neural Structure, Simsense Vertigo, Spike Resistance, Gremlins. Requires the
  SR2E system's new `quality` item type (Edge/Flaw with a build-point value;
  Edges & Flaws list on the character bio tab). The other qualities discussed on
  p.14-15 are SR Companion entries Rigger 2 only annotates — out of scope.

### Rigger Electronics (`r2-sensors`, 14) — pack relabeled
- Content audit (`docs/CONTENT-AUDIT.md`) found 8 missed New Toys items in the
  Remote-Control-Accessories / Autosofts area (book p.97–100); added them and
  relabeled the pack from "R2 Sensors & ECM" to **R2 Rigger Electronics**.
- New gear: External Remote Control Deck; BattleTac IVIS & FDDM Master Units
  (RC Deck / external); Hitcher Jacks; Audio/Visual Screen Displays; Intercom
  Speaker. New autosofts (category `autosoft`): TAPS Sharpshooter (Gunnery),
  IPA ClearSight (Perception) — the only two the book defines.
- Original 6 (external EW modules) unchanged: encryption, rigger decryption,
  ECCM (tiered), protocol emulation, signal amplifier, storage memory (p.98).

### Rigger cyberware (`r2-cyberware`, 10)
- Remote Control Deck, BattleTac IVIS/FDDM master units, remote-control
  encryption & decryption modules, ECCM (tiered), rigger protocol-emulation
  module, cyberlimb signal booster, and the Snake-Eyes interface/FDDM links.
  From the New Toys cyberware table (book p.96).

Open captures logged in `docs/NEEDS-CAPTURE.md`: Block II Outlaw cost;
vehicle-weapon ranges (p.107 table); Snake-Eyes FDDM Street Index; cyberlimb
signal booster Essence.
