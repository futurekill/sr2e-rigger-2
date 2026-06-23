// Generate Rigger 2 vehicle modifications into packs-src/r2-vehicle-mods (Item
// type "vehicle_mod"). These are the Vehicle Customization modifications (book
// p.124-128, verified against the page renders). Many are priced as a FORMULA
// (multiply the vehicle's cost, or a per-Armor-Point / per-seat figure) rather
// than a flat price, so `cost` holds a representative value and the full pricing
// rule lives in `notes`. VehicleModData = { modType, rating, cost, installed,
// notes }. Re-run, then `npm run build-packs r2-vehicle-mods`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-vehicle-mods";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-vmod:" + s).digest("hex").slice(0, 16);

function mod(m) {
  const _id = idFor(m.name);
  return {
    _id, name: m.name, type: "vehicle_mod", img: m.img ?? "icons/svg/upgrade.svg",
    system: {
      modType: m.modType ?? "general", rating: m.rating ?? 0,
      cost: m.cost ?? 0, designPoints: m.dp ?? 0,
      dpPerLevel: m.dpPerLevel ?? 0, dpTable: m.dpTable ?? [],
      cfConsumed: m.cf ?? 0, cfPerLevel: m.cfPerLevel ?? 0, cfTable: m.cfTable ?? [],
      loadReduction: m.load ?? 0, loadPerLevel: m.loadPerLevel ?? 0, loadTable: m.loadTable ?? [],
      installed: false, notes: m.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const MODS = [
  // --- Control & handling modifications (book p.124-126) ---
  { name: "Contingency Maneuver Controls (CMC)", modType: "control", rating: 9, cost: 2500,
    notes: "Redundant wiring, circuit breakers, and backup systems that let a vehicle ignore some crash damage up to the CMC Rating (deadly-level damage still applies normally). Parts cost = 2,500¥/rating (R1–3), 5,000¥/rating (R4–6); max Rating 9; Avail 6/14 days; Street Index 2; Base Time 60 hrs; load −30 kg. Rigger 2 p.124." },
  { name: "Datajack Port", modType: "control", cost: 2500,
    notes: "Lets a rigger control the vehicle directly through a datajack — rudimentary cybernetic control without the Reaction/Initiative bonuses of a VCR. Parts cost 2,500¥ (5,000¥ on motorcycles); Avail 3/72 hrs; Street Index 1.5; Base Time 56 hrs (112 on bikes); load −15 kg. Rigger 2 p.124." },
  { name: "Drive-by-Wire System", modType: "control", rating: 3, cost: 0,
    notes: "Replaces mechanical linkages with computer-mediated controls (Levels 1–3), trading Handling for Acceleration/Speed. Design cost = chassis Design Point cost × 1.75 per level; max −3 Handling. Parts cost = vehicle's original cost × the level; Avail 8/16 days; Street Index 2; needs B/R, Computer & Electronics. Rigger 2 p.124." },
  { name: "Improved Control Surfaces (Watercraft)", modType: "handling", cost: 0,
    notes: "Reshaped rudders and control surfaces that improve a boat's Handling (watercraft only). Parts cost = vehicle's original cost × 1.15 per 1-point Handling improvement; max −2 Handling; Avail 6/12 days; Street Index 2; Base Time (levels × 40) hrs. Rigger 2 p.125." },
  { name: "Improved Suspension (Ground Vehicles)", modType: "handling", cost: 0,
    notes: "Upgraded suspension that improves on-road Handling (ground vehicles only). Parts cost = vehicle's original cost × 1.10 per 1-point Handling improvement; max −2 Handling; Avail 6/12 days; Street Index 2; Base Time (increment × 40) hrs. Rigger 2 p.125." },
  { name: "Off-Road Suspension", modType: "handling", cost: 0,
    notes: "Improves off-road Handling at the expense of fuel economy and on-road Handling. Parts cost = original cost × 1.35/point (cars), × 1.20/point (motorcycles), or × 1.50/point (medium/heavy transports & tractors); max +2/−2 Handling; economy ×1.15 (cars) / ×1.30 (bikes) / ×1.40 (transports); Avail 6/12 days; Street Index 2. Rigger 2 p.125." },
  { name: "Remote-Control Interface", modType: "control", rating: 1, cost: 0,
    notes: "Lets a vehicle receive and transmit remote-control data, giving it an initial Pilot Rating of 1 and remote autonomy. Parts cost = 2,500¥ × Body; Avail 4/72 days; Street Index 2; Base Time 16 hrs; needs B/R & Electronics. Rigger 2 p.125–126." },
  { name: "Remote Pilot Advanced Programming", modType: "control", rating: 5, cost: 5000,
    notes: "Upgrades a remote-control interface's onboard Pilot Rating (up to Pilot 5). Parts cost by level: P2 5,000¥, P3 25,000¥, P4 125,000¥, P5 500,000¥; Avail 6/14 days (P2–3), 10/35 (P4), 14/70 (P5); Street Index 2 (P2–3), 4 (P4); Base Time 64 hrs. Rigger 2 p.126." },
  { name: "Rigger Adaptation", modType: "control", cost: 2800,
    notes: "A 'black box' translating machine code to neural stimuli and back, so a rigger controlling the vehicle through a VCR gets the full Control Pool and Reaction/Initiative bonuses. Parts cost 2,800¥; Avail 4/7 days; Street Index 2; Base Time 4 hrs; 1 CF (plus the datajack-port/remote-control CF); load −10 kg. Rigger 2 p.126." },
  { name: "Secondary Controls", modType: "control", cost: 400,
    notes: "A duplicate set of steering and operating controls for a co-pilot or driving instructor (not available for motorcycles). Parts cost 400¥; Avail 3/72 hrs; Street Index 1; Base Time 40 hrs; Target Number 4. Rigger 2 p.126." },
  // --- Protective system modifications (book p.127-128) ---
  { name: "Standard Vehicle Armor", modType: "armor", cost: 1250, dpPerLevel: 50,
    notes: "Hardened ceramic/metallic armor plating, priced per Armor Point (rating limited by the vehicle's Load Rating). Parts cost = 1,250¥ per Armor Point; load −(Body × Body × 5) kg/point; every 6 points worsens Handling by 1; Avail 6/12 days; Street Index 2.5; Base Time (armor × 8) hrs; Target Number = desired Armor + 3. Rigger 2 p.127." },
  { name: "Concealed Vehicle Armor", modType: "armor", cost: 2000, dpPerLevel: 50,
    notes: "Armor hidden inside the vehicle's interior/cargo space so it isn't obvious the vehicle is armored — not compatible with standard armor. Parts cost = 2,000¥ per Armor Point; 3 CF/point; load −(Body × Body × 5) kg/point; Avail 6/21 days; Street Index 3.5; Base Time (armor × 8) hrs. Rigger 2 p.127." },
  { name: "Ablative Armor", modType: "armor", rating: 3, cost: 700,
    notes: "Sacrificial ceramic-metallic plates (~10 cm each) that reduce damage and flake away; max added Armor equals the vehicle's Body. Customization-only (no Skill Test, 6 hrs to fit/replace), reduces Load by (Body × 100). Tier cost/availability: L1 700¥ 8/14 days, L2 1,500¥ 12/14 days, L3 2,500¥ 14/21 days; Street Index 2. Rigger 2 p.127." },
  { name: "Advanced Passenger Protection System (APPS)", modType: "protection", cost: 2500,
    notes: "Secured seat belts, impact-activated airbags, and reinforced seat panels; allows a Strength (5) Test to reduce crash damage to occupants (not for motorcycles). Parts cost 2,500¥ per seat; Avail 3/6 days; Street Index 1; Base Time 40 hrs; Target Number 4. Rigger 2 p.128." },
  { name: "Crash Cage", modType: "protection", cost: 3500,
    notes: "A padded, hydraulically-cushioned passenger cage that protects occupants in a crash (grants a Damage Resistance Test); not for motorcycles. Parts cost 3,500¥; Avail 6/96 hrs; Street Index 2; Base Time 16 hrs; load −25 kg. Rigger 2 p.128." },
  { name: "EnviroSeal System", modType: "protection", cost: 0,
    notes: "Seals the vehicle against gas, water, or vacuum (separate engine seal required). Parts cost by tier: gas seal Body × 250¥, water seal Body × 750¥, engine seal Body × 1,000¥, cabin overpressurization Body × 5,000¥; Avail 8/14 days; Street Index 2.5; Base Time 12 hrs; 1 CF (2 CF w/overpressurization); not for motorcycles. Rigger 2 p.128." },
  { name: "Life Support System", modType: "protection", cost: 500,
    notes: "Provides oxygen and basic climate control inside a sealed vehicle, rated in man-hours of support. Parts cost = 500¥ + 100¥ per man-hour; load −(25 kg per 10 man-hours); Avail 8/14 days. Rigger 2 p.128." },
  { name: "Roll Bars", modType: "protection", cost: 2000,
    notes: "Adds rigidity that mitigates roll-over damage: negates the doubled Damage Resistance penalty for hard-tops and grants +3 dice to the occupant's Damage Resistance Test in a roll. Also required to mount some weapons on civilian vehicles. Parts cost 2,000¥; Avail 3/72 hrs; Street Index 1; Base Time 24 hrs. Rigger 2 p.129." },
  { name: "Smart Armor System (SAS)", modType: "armor", cost: 20000,
    notes: "Reactive (proactive) armor of small explosive cells that detonate outward to defeat incoming rounds. On each hit, roll 2d6 vs an Activation TN (1 on the first hit, +1 each subsequent hit) — on success, reduce the attack's damage code by a level (standard anti-vehicle reductions still apply). Military-grade. Parts cost 20,000¥ install / Body × 500¥ replacement; load −(Body × 50) kg/point; Avail 10/28 days; Base Time (Body × 40) hrs. Rigger 2 p.129." },
  { name: "Thermal Baffles", modType: "signature", cost: 0,
    notes: "Heat-blocking baffles that mask a vehicle's thermographic signature (gasoline/methane/diesel/jet engines). Parts cost per +1 Signature: ground Body × 5,000¥, motorcycles Body × 6,000¥, trucks/fixed-wing Body × 7,500¥, tractors/helicopters Body × 10,000¥, hovercraft Body × 3,750¥, watercraft/zeppelins Body × 2,500¥; max +2; load −(Body × 50) kg/level; Avail 6/14 days; Street Index 3. Rigger 2 p.130." },
  { name: "Active Thermal Masking", modType: "signature", cost: 0,
    notes: "A high-powered coolant system that actively absorbs engine heat; each active level masks +1 Signature but costs 15 m of Speed Rating while running. Cost = engine-customization cost × 2 for the first level, +0.25 to the multiplier per added level; max equals the engine-customization level; Avail 8/21 days; Street Index 2; load −100 kg. Rigger 2 p.130." },
  { name: "Radar-Absorbent Materials (RAM)", modType: "signature", cost: 25000,
    notes: "Radar-absorbing coatings/enamels that mask a vehicle's radar signature; each level adds +1 (max +3). Automatically makes the vehicle military-grade — very hard to obtain. Design cost = levels × 50 points; parts cost = levels × 25,000¥; Avail 18/30 days; Street Index military only. Rigger 2 p.130." },
  { name: "Firearm Conversion Kit", modType: "weapon", cost: 150,
    notes: "Required to mount a personal firearm on a vehicle weapon mount. Cost/availability by class: Pistol 150¥ 4/36 hrs (SI 2); SMG 150¥ 5/48 hrs (SI 2, −0.25 kg); Rifle/Shotgun/LMG 750¥ 6/72 hrs (SI 2.5, −0.5 kg); Heavy Weapons 1,000¥ 16/14 days (SI 2.5, −1 kg). Rigger 2 p.131." },
  { name: "Fixed Weapon Mount", modType: "weapon", cost: 2000,
    notes: "A hard/firmpoint with a weapon permanently affixed, firing in a fixed arc (aimed by moving the vehicle; doubled recoil on hovercraft). Parts cost & CF by type: external hardpoint 2,000¥/1 CF, external firmpoint 750¥/0.5 CF, internal hardpoint 3,000¥/4 CF, internal firmpoint 1,500¥/3 CF; Avail 6/7 days; Street Index 2; Base Time 24 hrs; load −(10 kg + weapon weight). Rigger 2 p.131–132." },
  { name: "Gunnery Recoil Adjuster", modType: "weapon", cost: 500,
    notes: "Precision micro-actuators in a weapon mount that compensate recoil; each level negates 1 point of recoil (not compatible with gyro-stabilization). Max level by mount: fixed firmpoint/micro-turret 3, mini-turret 6, small turret/fixed hardpoint 9, medium+ turret 12. Parts cost 500¥/level; Avail 6/48 hrs; Street Index 1.5; load −(Rating + 24) kg. Rigger 2 p.132." },
  { name: "External Missile/Rocket Mount", modType: "weapon", cost: 0,
    notes: "An external firing system (one firmpoint) for missiles or rockets; reduces the vehicle's Signature by 1 while loaded. Ground vehicles carry up to Body Rating missiles/rockets; aircraft carry more (up to 300 kg). Rigger 2 p.133." },
  { name: "Internal Missile/Rocket Mount", modType: "weapon", cost: 0,
    notes: "An internal firing system (one firmpoint) for missiles or rockets — does not reduce Signature and is protected by the vehicle's armor. Carries up to (Body × 3) rounds; the mounting actuators consume an extra 2 CF. Rigger 2 p.133." },
  { name: "Pintle Mount", modType: "weapon", cost: 50, dp: 1,
    notes: "The simplest mount — a reinforced swivel socket (one firmpoint) accepting any firmpoint-sized weapon; ~60° left/right and 30° up/down arc, and grants 2 points of recoil compensation. Cannot be operated remotely by a jacked-in rigger; mounting/removing is a Complex Action (+ Quickness (3) Test if moving). Parts cost 50¥; Avail 4/96 hrs; Street Index 1.5; Base Time 12 hrs. Rigger 2 p.133." },
  { name: "Ring Mount", modType: "weapon", cost: 3000, dp: 10,
    notes: "A freely-rotating ring with a tripod, a step up from a pintle mount (hardtop or roll-bar-equipped vehicles only); counts as a hardpoint, can be operated remotely by a jacked-in rigger, and grants 6 points of recoil compensation. Parts cost 3,000¥; Avail 8/14 days; Street Index 2; Base Time 8 hrs; 1 CF (16 CF for door-gun config); load −25 kg. Rigger 2 p.133–134." },
  { name: "Smartlink Integration Kit", modType: "weapon", cost: 650,
    notes: "Connects a smartgun-equipped weapon in a fixed mount or turret to the gunner. Level I (650¥, 4/48 hrs, SI 1) requires the gunner to be jacked into the vehicle; Level II (900¥, 6/48 hrs, SI 2) adds palm-induction links so the gunner needn't be jacked in. Not needed for pintle/ring mounts. Base Time 24 hrs. Rigger 2 p.134." },
  { name: "Weapon Turret", modType: "weapon", cost: 5000,
    notes: "A motorized, armored ring mount that protects its weapon (−1 to the vehicle's Signature). Sizes by max Weapon Value / hardpoints / parts cost: Mini (WV 2, 1 hp, 5,000¥, 7 CF, −25 kg), Small (WV 3, 2 hp, 7,500¥, 8 CF, −100 kg), Medium (WV 6, 3 hp, 15,000¥, 16 CF, −1,000 kg); Large (WV 8, 4 hp) and Extra-Large (WV 10, 6 hp) are custom-built. Anti-aircraft variant ×1.5 cost +1 CF; pop-up variant ×2 cost, doubled CF. Avail by formula; SI 2–3. Rigger 2 p.134–135." },
  { name: "Remote Weapon Turret", modType: "weapon", cost: 2500,
    notes: "A weapons-only turret the operator controls from inside via remote sensors (a second rigger can run it independently of the driver). Sizes by parts cost / CF / load: Micro (2,500¥, 1 CF, −10 kg; pop-up micro = WV 1, 1 firmpoint), Mini (3 CF... , −25 kg), Small (9,000¥, 5 CF, −100 kg), Medium (8 CF, −1,000 kg). Avail per formula; Street Index 2 (micro/mini), 3 (small/medium); Base Time 72 hrs. Rigger 2 p.135–136." },
  { name: "Vehicle Gyroscopic Stabilizer", modType: "weapon", cost: 1000,
    notes: "Stabilizes weapons in fixed mounts/turrets — each level negates 1 point of combined recoil + movement modifiers (not compatible with gunnery recoil adjusters). If total active rating exceeds the vehicle's Body, Handling worsens by 1 per point over Body. Parts cost 1,000¥/level; max 2 × Body; load −(Rating × 24) kg; Avail 8/72 hrs; Street Index 1; Base Time 24 hrs. Rigger 2 p.136." },
  { name: "BattleTac FDDM Receiver Module", modType: "electronics", cost: 35000,
    notes: "Lets a remote-controlled vehicle/drone share targeting data over a BattleTac FDDM network, enabling indirect fire on targets outside its own line of sight. Parts cost = Pilot Rating × 35,000¥; design = Pilot × 350 points; Avail 10/21 days; Street Index 3; Base Time 64 hrs; needs Computer B/R + a microtronics shop. Rigger 2 p.136." },
  { name: "BattleTac IVIS Receiver Module", modType: "electronics", cost: 25000,
    notes: "Lets a remote-controlled vehicle/drone join a BattleTac IVIS network for coordinated tactics — provides extra dice on the Comprehension Test or an Initiative Pool for the drones (the Pilot must be modified to interface with IVIS). Parts cost = Pilot Rating × 25,000¥; design = Pilot × 250 points; Avail 8/14 days; Street Index 3; Base Time 64 hrs; needs Computer B/R. Rigger 2 p.136." },
  { name: "Electronic Countermeasures (ECM)", modType: "electronics", rating: 10, cost: 25000,
    notes: "Active jamming — barrage radio/infrared jammers, chaff, flare dispensers, harmonic disrupters — that foul enemy sensors and remote-control comms (security/military only). Cost & weight by Level: L1 25,000¥/12 kg/SI 2.5, L2 75,000¥/25, L3 125,000¥/35, L4 250,000¥/50, L5 375,000¥, L6 750,000¥, L7 1.5M¥, L8 7.5M¥, L9 15M¥, L10 30M¥; Avail 5/7 days (L1) up to 20/1 year (L10). Rigger 2 p.137." },
  { name: "Electronic Counter-Countermeasures (ECCM)", modType: "electronics", rating: 10, cost: 10000,
    notes: "Signal amplifiers and noise filters that nullify enemy ECM (generally more available than ECM). Leveled 1–10. Per-level Customization Cost: L1 10,000¥, L2 30,000¥, L3 100,000¥, L4 100,000¥, L5 150,000¥, L6 250,000¥, L7 750,000¥, L8 2.5M¥, L9 6M¥, L10 12M¥ (L3 and L4 both list 100,000¥ in the book). Weight 12 kg (L1) up to 250 kg (L10); Avail 4/7 days (L1) up to 18/1 year (L10); Base Time 16 hrs/level. Rigger 2 p.138." },
  { name: "Electronic Deception (ED)", modType: "electronics", rating: 6, cost: 50000,
    notes: "Feeds sensors false data about a target's range, position, and heading — subtler than ECM (a sensor isn't aware it's deceived). Cost & weight by Level: L1 50,000¥/35 kg/SI 3, L2 190,000¥/45/SI 3.5, L3 400,000¥/60/SI 4, L4 1M¥/60/SI 4.5, L5 4M¥/60/SI 5, L6 8M¥/110; Avail 8/30 days (L1) up to 16/1 year (L6). Rigger 2 p.138." },
  { name: "Electronic Counter-Deception (ECD)", modType: "electronics", rating: 6, cost: 25000, dpTable: [100, 300, 800, 3000, 8000, 20000],
    notes: "Reality-checking components (inertial nav, flux-density monitors) that negate enemy Electronic Deception (security/military only). Cost & weight by Level: L1 25,000¥/35 kg/SI 3, L2 80,000¥/45/SI 3.5, L3 200,000¥/60/SI 4, L4 750,000¥/60/SI 4.5, L5 2M¥/60/SI 5, L6 5M¥/110; Avail 8/30 days (L1) up to 16/1 year (L6); Base Time 10 hrs/level. Rigger 2 p.139." },
  { name: "Electronics Port", modType: "electronics", cost: 1000, dp: 10,
    notes: "A powered mount for electronics unrelated to driving (radios, cameras, surveillance gear, a remote-control deck); attached devices draw vehicle power and gain +½ the vehicle's Body (round up) to their Flux Rating. Parts cost = 1,000¥ + the equipment's cost; 1 CF per 0.1 m³ of equipment; Avail 3/6 days; Street Index 1; Base Time 8 hrs. Rigger 2 p.139." },
  { name: "Power Amplifier", modType: "electronics", rating: 10, cost: 250, dpPerLevel: 5,
    notes: "Boosts the Flux Rating of sensors, ECM/ECCM, and hardwired remote-control decks — extending remote-control range and EW resistance. Parts cost 250¥/rating (max Rating 10); load −1 kg/rating; Avail Rating + (Rating × 12) hrs; Street Index 1.5; Base Time 8 hrs. Rigger 2 p.139." },
  { name: "Sensors (Vehicle Sensor System)", modType: "electronics", rating: 10, cost: 5000,
    notes: "Standard-to-military sensor suites (audio/video, thermal, radar, ultrasound) with ID/recognition/tracking software; higher levels are restricted. Cost & weight by Level: L1 5,000¥/12 kg/SI 2, L2 15,000¥/25/SI 2.5, L3 25,000¥/35/SI 3, L4 50,000¥/50/SI 3.5, L5 75,000¥, L6 125,000¥, L7 375,000¥, L8 1.25M¥, L9 3M¥, L10 6M¥; Avail 4/7 days (L1) up to 18/1 year (L10); Base Time 16 hrs/level. Rigger 2 p.139–140." },
  { name: "Aircraft Drop Tanks", modType: "accessory", cost: 8000,
    notes: "A jettisonable pair of external fuel tanks (1,000 L each) fitted in place of two external mounts; adds 2,000 L fuel and −1 Signature, but each extra pair costs −15 Speed (every two pairs +1 Handling). Body 1, Armor 3; a pair costs 8,000¥ (install parts 2,500¥); Avail 5/10 days; Street Index 1.25; Base Time 32 hrs. Rigger 2 p.140." },
  { name: "Amphibious Operation Package", modType: "accessory", rating: 3, cost: 2500,
    notes: "Modifies a ground vehicle to travel on/through water (needs watertight seals + life support + sealed power plant for full submersion). L1 (2,500¥, wheels propel at Speed 15, +2 Handling), L2 (7,500¥, propeller drive, Speed 30, no penalty, 2 CF), L3 (15,000¥, water-jet/impeller, Speed 45, no penalty, 2 CF); Avail 5/10–3/6 days; Street Index 1–1.5. Rigger 2 p.140–141." },
  { name: "Anti-Theft System", modType: "accessory", rating: 10, cost: 100,
    notes: "Rated 1–10 (the rating = dice in an opposed test vs an intruder's Electronics/Maglocks). Parts cost by tier: R1–3 100¥/rating (SI 1), R4–6 400¥ (SI 1.25), R7–9 1,000¥ (SI 1.5), R10+ 5,000¥ (SI 2). Optional responses: automated security call; standard shock system +2,000¥ (10S Stun); or an explosive self-destruct (plastic explosive, Power = Body²). Base Time 40 hrs. Rigger 2 p.141." },
  { name: "Vehicle Seats (Bench/Bucket)", modType: "accessory", cost: 700,
    notes: "Replacement seating. Parts cost: standard bucket 700¥, standard bench 750¥, folding bench 0¥, reinforced bench 1,500¥, reinforced bucket 1,500¥ (+100¥ per 25 kg of support over 250 kg); 6–8 CF; Avail 3/48 hrs; Street Index 1; Base Time 4 hrs. Bench-seat armor costs 1,250¥/point. Rigger 2 p.142–143." },
  { name: "Ejection Bucket Seat", modType: "accessory", cost: 3000,
    notes: "A bucket seat with a small solid-fuel rocket, stabilization, and a para-raft that deploys to lower a strapped-in occupant safely; activation controls sited at install. Parts cost 3,000¥ (reinforced 6,000¥; double for reinforced ejection); design 35/60 points; 6 CF; load −100 kg (−250+ reinforced); Avail 5/10 days; Street Index 2. Rigger 2 p.142." },
  { name: "Convertible Top (Rag-Top)", modType: "accessory", cost: 2500,
    notes: "Replaces a hardtop roof with a retractable folding canopy; gives no protection from side/rear/top attacks, and without a roll bar doubles the TN on post-crash passenger Damage Resistance Tests. Parts cost = vehicle cost × 0.1 + 2,500¥; Avail 4/72 hrs; Street Index 1; Base Time 24 hrs. Rigger 2 p.143." },
  { name: "Crane", modType: "accessory", cost: 0,
    notes: "A hydraulic boom for lifting heavy loads (vehicle must be stationary and chocked; not available on Body-0 vehicles). The crane has its own Load Rating up to the Crane Capacity Table max by Body: B1 25 kg, B2 200, B3 750, B4 2,000, B5 5,000, B6 20,000, B7 30,000, B8 45,000, B9 60,000, B10+ Body²×750. Parts cost = Load Rating × 100¥; 35 CF; load −(Body × 80) kg; Avail 6/14 days; Street Index 2. Rigger 2 p.143–144." },
  { name: "Drone Rack", modType: "accessory", cost: 0,
    notes: "A cradle that launches and recovers airborne drones from a moving vehicle and stores them as an armored mini-hangar (same Armor as the vehicle, ½ its Body). Launching takes two actions; recovery needs Handling Tests from both drivers. Design cost = Body × 12 points; parts cost scales per Body point; CF = drone storage + 2 CF; Avail 6/14 days; Street Index 2. Rigger 2 p.144." },
  { name: "External Cargo Mount", modType: "accessory", cost: 250,
    notes: "Roof racks or motorcycle side cargo-boxes — no CF cost, but Handling worsens by 1 while loaded; capacity up to the vehicle's internal cargo space. Customization-only. Parts cost 250¥ per CF held; Avail 3/24 hrs; Street Index 1; Base Time 8 hrs; load −45 kg. Rigger 2 p.144." },
  { name: "Floatation Package (Aircraft)", modType: "accessory", cost: 2500,
    notes: "Floats for an aircraft or helicopter for water operation. Aircraft: economy ×1.20, Speed halved, cannot land on land. Helicopters: Speed ×0.9, can still land on land. Parts cost = vehicle cost × 0.1 + 2,500¥; design = chassis Point Value × 1.20; Avail 4/7 days; Street Index 2. Rigger 2 p.144." },
  { name: "Hovercraft Water Seals", modType: "accessory", cost: 0,
    notes: "Watertight chassis seals so a powered-down hovercraft floats instead of sinking (a normal hovercraft sinks within 30 min over water). Parts cost = Body × 500¥; design = Body × 5 points; Avail 4/96 hrs; Street Index 1; Base Time 32 hrs. Rigger 2 p.145." },
  { name: "Mechanical Arms", modType: "accessory", cost: 25000,
    notes: "Articulated arms (Body = ½ vehicle Body) — weaker than a crane but dextrous, doing anything a metahuman arm can; base Strength scales, lifts (Strength × 50) kg, and can mount most cyberarm accessories (at half a cyberarm's cost). Strength may be bought up: parts +75,000¥/point (1–3) or +90,000¥/point (4+); base parts 25,000¥; 4 CF; load −(Strength × 25) kg; Avail 4/4 days; needs Cybertechnology B/R. Rigger 2 p.145." },
  { name: "Motorcycle Sidecar", modType: "accessory", cost: 1000,
    notes: "A sidecar (Body = the cycle's): −15 Speed, +Handling, economy ×0.9. Sizes by cargo/Handling/cost: Small 4 CF/+1/1,000¥, Medium 8 CF/+1/2,000¥, Large 12 CF/+2/3,500¥ (seating eats the cargo CF). Mount/remove in 15 min; armor upgradeable per the standard rules. Rigger 2 p.145." },
  { name: "Spotlight", modType: "accessory", cost: 600,
    notes: "A concentrated beam (effective range 600 m; spot ~0.5 m at the source widening to ~5 m at max), controllable manually or remotely from inside; also available in invisible medium-range infrared. Parts cost 600¥; Avail 4/96 hrs; Street Index 1.5; Base Time 1 day. Rigger 2 p.145–146." },
  { name: "Tires", modType: "accessory", cost: 0,
    notes: "Replacement tires (spares take ½ Body CF). Cost each by type: Standard Body × 50¥ (halves suspension/Handling mod benefits), Performance Body × 75¥ (for improved suspension/drive-by-wire), Off-Road Body × 125¥ (required for off-road suspension), Dual-Purpose Body × 250¥ (on/off-road active suspension); Runflat = tire cost + 200¥ (5/3 armor protection). Rigger 2 p.146." },
  { name: "Winch", modType: "accessory", cost: 0,
    notes: "A bumper winch for pulling/towing/lifting, with its own Load Rating up to the Winch Capacity Table max by Body: B0 5 kg, B1 25, B2 200, B3 750, B4 2,000, B5 5,000, B6 20,000, B7 30,000, B8 45,000, B9 60,000, B10+ Body²×750. Parts cost = Load Rating × 75¥; load −(Body × 2.5) kg; Avail 6/14 days; Street Index 1.5; Base Time 1 day. Rigger 2 p.146." },
  // --- Engine & early customization mods (book p.118-123) — these were missed
  //     when transcription started at p.124; they double as the design engine's
  //     engine/control design options. ---
  { name: "Structural Agility", modType: "control", cost: 0,
    notes: "Requires the Drive-by-Wire System. Each level grants +1 Reaction to a character driving the vehicle (and to a rigger's Control Pool); max level = the vehicle's Drive-by-Wire level. Design cost 150 points per level. Rigger 2 p.118." },
  { name: "Engine Customization", modType: "engine", cost: 0,
    notes: "Radically re-tunes the engine to exceed the power plant's standard maxima. Each level adds +30 Speed OR +5 Acceleration OR +(Body × 50) kg Load (each rating bought separately); max = the power-plant maximum × 1.75. Design cost = power-plant Design-Point cost × 1.25 for the first level, +0.5 to the multiplier per added level; parts cost = original power-plant cost × the same multiplier; Avail 8/14 days; Street Index 2; Base Time 40 hrs/level. (Can stress the engine — see book.) Rigger 2 p.120." },
  { name: "GridLink Power", modType: "engine", cost: 600,
    notes: "Lets an electric ground vehicle draw power from a city's buried GridLink induction grid at normal traffic speeds (no battery drain). Monthly grid fee = Body × 100¥ (cars), × 25¥ (motorcycles), or × 250¥ (trucks/buses). Parts cost 600¥; 1 CF; Avail 3/96 hrs; Street Index 1; Base Time 16 hrs. Rigger 2 p.121." },
  { name: "Nitrous Oxide Injectors", modType: "engine", rating: 6, cost: 3500, dpPerLevel: 55,
    notes: "Injects nitrous into a gas/diesel engine for a short boost (gas-cylinder holds up to 20 charges, level charges/use). In an Accelerating/Braking Test add Rating extra dice, or push Speed to ×2.5 standard (then decelerate by the Accel Rate each turn until back under standard). Design 55 points/level; max Rating 6; parts cost 3,500¥/level (L1–3), 7,000¥/level (L4–5); Avail 4/48 hrs; Street Index 1; 2 CF; load −15 kg. Rigger 2 p.121." },
  { name: "SurCell Power", modType: "engine", cost: 500, dp: 5,
    notes: "Externally-mounted solar cells that feed an electric vehicle Body × 25 PF/hour on a sunny day (half in cloud, none at night/heavy overcast); not for motorcycles. Design 5 points; parts cost 500¥; Avail 3/72 hrs; Street Index 1; Base Time 8 hrs. Rigger 2 p.121." },
  { name: "Turbocharging / Superconductive Drive", modType: "engine", cost: 0,
    notes: "Turbine boost for methane/gas/diesel engines (the 'superconductive drive' does the same for electric). Each level adds +15 Speed and +10 Acceleration; new max Speed = initial max × 1.25. Design cost = power-plant Design-Point cost × 1.5 per level; parts cost = vehicle's original cost × 1.10 per level; Avail 6/12 days; Street Index 2; Base Time 8 hrs. Rigger 2 p.122." },
  { name: "Adjusted Controls", modType: "control", cost: 2500,
    notes: "Re-fits manual controls (wheel, pedals, dashboard) to a non-standard body — dwarfs, trolls, or any metahuman whose size/disability prevents using standard controls. Design 25 points; parts cost 2,500¥; Avail 3/72 hrs; Street Index 1; Base Time 16 hrs. Rigger 2 p.122." },
  { name: "Autonavigation System", modType: "control", rating: 4, cost: 500, dpTable: [5, 10, 50, 150],
    notes: "Onboard auto-pilot/navigation (the Autonav Rating adds dice to standard Driving Tests, but is ignored in vehicle combat). Rating 1 collision-avoidance (the only autonav fittable to a motorcycle), 500¥/5 DP/2/96 hrs/SI 1; Rating 2 route-following on mapped terrain, 4,000¥/10 DP/3/6 days/SI 2; Rating 3 rough-terrain + GPS, 5,000¥/50 DP/4/8 days/SI 3; Rating 4 urban off-road + re-routing, 15,000¥/150 DP/6/14 days/SI 3. Install TN = 8 − Handling. Rigger 2 p.122–123." }
];

// Design-Point cost of each mod as a design option (Rigger 2 "Design Cost",
// book p.118-146), evaluated by the system against the mod's Rating:
//   dpTable (by rating) | designPoints (flat base) + dpPerLevel (×rating).
// This map is the single source of truth (it overrides any inline values).
// "Exceptions" below depend on the build (power-plant/chassis/Body/Pilot) or are
// metatype-specific, so they can't be a function of the mod alone — they stay 0
// and are entered via the design's manual "Extra DP" (see DESIGN-ENGINE.md).
const DP_RULES = {
  // Engine
  "SurCell Power":                  { designPoints: 5 },
  "Nitrous Oxide Injectors":        { dpPerLevel: 55 },
  "GridLink Power":                 { designPoints: 0 },
  // Control
  "Datajack Port":                  { designPoints: 25 },
  "Rigger Adaptation":              { designPoints: 35 },
  "Secondary Controls":             { designPoints: 35 },
  "Contingency Maneuver Controls (CMC)": { dpTable: [35, 70, 105, 300, 375, 450, 1050, 1200, 1350] },
  "Remote Pilot Advanced Programming":   { dpTable: [0, 50, 250, 1250, 5000] },
  "Autonavigation System":         { dpTable: [5, 10, 50, 150] },
  // Protective
  "Standard Vehicle Armor":         { dpPerLevel: 50 },
  "Concealed Vehicle Armor":        { dpPerLevel: 50 },
  "Ablative Armor":                 { dpPerLevel: 50 },
  "Smart Armor System (SAS)":       { designPoints: 250 },
  "Advanced Passenger Protection System (APPS)": { dpPerLevel: 30 },
  "Crash Cage":                     { designPoints: 40 },
  "Life Support System":            { designPoints: 5, dpPerLevel: 1 },
  "Roll Bars":                      { designPoints: 0 },
  "Thermal Baffles":                { dpPerLevel: 75 },
  "Radar-Absorbent Materials (RAM)":{ dpPerLevel: 50 },
  // Weapon mounts
  "Firearm Conversion Kit":         { designPoints: 1 },
  "Fixed Weapon Mount":             { designPoints: 25 },
  "Gunnery Recoil Adjuster":        { dpPerLevel: 10 },
  "Pintle Mount":                   { designPoints: 1 },
  "Ring Mount":                     { designPoints: 10 },
  "Smartlink Integration Kit":      { designPoints: 250 },
  "Weapon Turret":                  { designPoints: 125 },
  "Remote Weapon Turret":           { designPoints: 100 },
  "Vehicle Gyroscopic Stabilizer":  { dpPerLevel: 15 },
  // Electronic
  "Electronic Countermeasures (ECM)":          { dpTable: [250, 750, 1250, 2500, 1250, 1500, 5000, 7500, 12500, 25000] },
  "Electronic Counter-Countermeasures (ECCM)": { dpTable: [100, 300, 500, 1000, 500, 750, 2000, 3500, 5000, 10000] },
  "Electronic Deception (ED)":      { dpTable: [150, 400, 1000, 2500, 10000, 20000] },
  "Electronic Counter-Deception (ECD)": { dpTable: [100, 300, 800, 3000, 8000, 20000] },
  "Electronics Port":               { designPoints: 10 },
  "Power Amplifier":                { dpPerLevel: 5 },
  "Sensors (Vehicle Sensor System)":{ dpTable: [50, 150, 250, 500, 250, 300, 1000, 1500, 2500, 5000] },
  // Miscellaneous / accessories
  "Amphibious Operation Package":   { dpTable: [25, 80, 200] },
  "Anti-Theft System":              { dpTable: [1, 2, 3, 16, 20, 24, 70, 80, 90, 100] },
  "Vehicle Seats (Bench/Bucket)":   { designPoints: 0 },
  "Ejection Bucket Seat":           { designPoints: 35 },
  "Convertible Top (Rag-Top)":      { designPoints: 0 },
  "Crane":                          { dpPerLevel: 2 },
  "Motorcycle Sidecar":             { designPoints: 10 },
  "Spotlight":                      { designPoints: 0 },
  "Tires":                          { designPoints: 0 },
  "Winch":                          { dpPerLevel: 1 }
};

// CF Consumed (Cargo Factor) and Load Reduction (kg) per mod (book p.115),
// evaluated against rating the same way as DP. Verified off the page renders;
// EW tables use the DESIGN CF column (the "x/y" cells = design/customization).
// Body-relative cells (armor Load = Body²×5/pt, EnviroSeal, Mechanical Arms,
// Life Support per-man-hour) are left 0 — they depend on the build, not the mod.
const CF_LOAD_RULES = {
  "Electronics Port":               { cf: 0.5 },
  "Ring Mount":                     { cf: 1, load: 25 },
  "Concealed Vehicle Armor":        { cfPerLevel: 2 },
  "Ablative Armor":                 { cfPerLevel: 3 },
  "Weapon Turret":                  { cf: 8 },          // mini turret
  "Power Amplifier":                { cfPerLevel: 0.25 },
  "Crash Cage":                     { load: 25 },
  "Gunnery Recoil Adjuster":        { load: 24, loadPerLevel: 1 },
  "Vehicle Gyroscopic Stabilizer":  { load: 24, loadPerLevel: 1 },
  "Electronic Countermeasures (ECM)":          { cfTable: [0, 1, 2, 3, 2, 4, 6, 10, 12, 16] },
  "Electronic Counter-Countermeasures (ECCM)": { cfTable: [0, 1, 2, 3, 2, 4, 6, 10, 12, 16] },
  "Electronic Deception (ED)":      { cfTable: [2, 4, 4, 4, 6, 8] },
  "Electronic Counter-Deception (ECD)": { cf: 1 },
  "Amphibious Operation Package":   { cfTable: [0, 0, 2] }
};

let n = 0;
for (const m of MODS) {
  // Reset any inline DP fields, then apply the authoritative rule (if any).
  m.dp = 0; m.dpPerLevel = 0; m.dpTable = [];
  m.cf = 0; m.cfPerLevel = 0; m.cfTable = []; m.load = 0; m.loadPerLevel = 0; m.loadTable = [];
  const rule = DP_RULES[m.name];
  if (rule) {
    if (rule.designPoints != null) m.dp = rule.designPoints;
    if (rule.dpPerLevel != null) m.dpPerLevel = rule.dpPerLevel;
    if (rule.dpTable != null) m.dpTable = rule.dpTable;
  }
  const cl = CF_LOAD_RULES[m.name];
  if (cl) {
    if (cl.cf != null) m.cf = cl.cf;
    if (cl.cfPerLevel != null) m.cfPerLevel = cl.cfPerLevel;
    if (cl.cfTable != null) m.cfTable = cl.cfTable;
    if (cl.load != null) m.load = cl.load;
    if (cl.loadPerLevel != null) m.loadPerLevel = cl.loadPerLevel;
    if (cl.loadTable != null) m.loadTable = cl.loadTable;
  }
  // Rated mods default to Rating 1 (minimum) so dragging one onto a vehicle
  // doesn't slam the maximum DP/cost — the player dials it up on the sheet.
  // (The full rating range stays in the mod's notes.) RATED_EXCEPTIONS are rated
  // mods whose Design Cost is a build-relative formula (no flat DP rule).
  const RATED_EXCEPTIONS = new Set(["Drive-by-Wire System"]);
  if (m.dpPerLevel || (m.dpTable && m.dpTable.length) || RATED_EXCEPTIONS.has(m.name)) m.rating = 1;
  const safe = m.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(m.name)}.json`, JSON.stringify(mod(m), null, 2) + "\n");
  n++;
}
const withDp = MODS.filter(m => m.dp || m.dpPerLevel || (m.dpTable && m.dpTable.length)).length;
console.log(`wrote ${n} vehicle mods (${withDp} with a Design-Point rule)`);
