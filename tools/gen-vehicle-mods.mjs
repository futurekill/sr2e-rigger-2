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
      cost: m.cost ?? 0, installed: false, notes: m.notes ?? ""
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
  { name: "Standard Vehicle Armor", modType: "armor", cost: 1250,
    notes: "Hardened ceramic/metallic armor plating, priced per Armor Point (rating limited by the vehicle's Load Rating). Parts cost = 1,250¥ per Armor Point; load −(Body × Body × 5) kg/point; every 6 points worsens Handling by 1; Avail 6/12 days; Street Index 2.5; Base Time (armor × 8) hrs; Target Number = desired Armor + 3. Rigger 2 p.127." },
  { name: "Concealed Vehicle Armor", modType: "armor", cost: 2000,
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
  { name: "Pintle Mount", modType: "weapon", cost: 50,
    notes: "The simplest mount — a reinforced swivel socket (one firmpoint) accepting any firmpoint-sized weapon; ~60° left/right and 30° up/down arc, and grants 2 points of recoil compensation. Cannot be operated remotely by a jacked-in rigger; mounting/removing is a Complex Action (+ Quickness (3) Test if moving). Parts cost 50¥; Avail 4/96 hrs; Street Index 1.5; Base Time 12 hrs. Rigger 2 p.133." }
];

let n = 0;
for (const m of MODS) {
  const safe = m.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(m.name)}.json`, JSON.stringify(mod(m), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} vehicle mods`);
