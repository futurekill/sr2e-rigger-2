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

### Vehicles & drones (`r2-vehicles`, 21 so far)
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

### Rigger cyberware (`r2-cyberware`, 10)
- Remote Control Deck, BattleTac IVIS/FDDM master units, remote-control
  encryption & decryption modules, ECCM (tiered), rigger protocol-emulation
  module, cyberlimb signal booster, and the Snake-Eyes interface/FDDM links.
  From the New Toys cyberware table (book p.96).

Open captures logged in `docs/NEEDS-CAPTURE.md`: Block II Outlaw cost;
vehicle-weapon ranges (p.107 table); Snake-Eyes FDDM Street Index; cyberlimb
signal booster Essence.
