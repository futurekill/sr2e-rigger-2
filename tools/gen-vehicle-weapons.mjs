// Generate Rigger 2 vehicle weapons into packs-src/r2-vehicle-weapons.
// Stats transcribed from the "New Toys: Weapons" tables (book p.92-94, verified
// against the page renders). Descriptions are original one-liners — no book
// prose. Vehicle-mounted weapons use the Gunnery skill. Re-run, then
// `npm run build-packs r2-vehicle-weapons`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-vehicle-weapons";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-vweapon:" + s).digest("hex").slice(0, 16);

const modes = (s) => {
  const p = (s || "").split("/");
  return { ss: p.includes("SS"), sa: p.includes("SA"), bf: p.includes("BF"), fa: p.includes("FA") };
};
// Range brackets store the upper bound (m) of each bracket. The autocannon,
// zapper, and jabberwocky values are from the R2 Weapon Ranges Table (book
// p.107). Miniguns have no R2-specific row — they fire like standard MMG/HMGs,
// so they use a generic heavy preset. Guided munitions (missiles/mines) use no
// bracket table; their reach is set by guidance, so range is left at 0.
const RANGE = {
  gun:        { short: 50,  medium: 150,  long: 350,  extreme: 550 },
  autocannon: { short: 100, medium: 500,  long: 2500, extreme: 5000 },
  zapper:     { short: 70,  medium: 250,  long: 750,  extreme: 2000 },
  jabberwocky:{ short: 750, medium: 2000, long: 3500, extreme: 11000 },
  none:       { short: 0,   medium: 0,    long: 0,    extreme: 0 }
};

function weapon(w) {
  const _id = idFor(w.name);
  return {
    _id, name: w.name, type: "weapon", img: w.img ?? "icons/svg/explosion.svg",
    system: {
      weaponType: "heavy", skill: "gunnery",
      damageCode: w.dmg, damageType: "physical",
      concealability: w.conceal ?? 99, reach: 0,
      firingModes: modes(w.mode ?? "SS"),
      ammo: { current: w.ammo ?? 0, max: w.ammo ?? 0, type: w.ammoType ?? "belt" },
      recoilComp: 0, smartgunCompatible: false,
      ranges: RANGE[w.range ?? "gun"],
      strengthMin: 0, weight: w.wt ?? 0,
      cost: w.cost ?? 0, availability: w.avail ?? "", legality: w.legality ?? "Forbidden",
      streetIndex: String(w.index ?? ""),
      equipped: false, accessories: [], notes: w.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const WEAPONS = [
  // --- Mounted guns ---
  { name: "Ares Vengeance Minigun", dmg: "9S", mode: "FA", ammoType: "belt", wt: 30, avail: "18/28 days", cost: 50000, index: 3.5, range: "gun", notes: "Vehicle-mounted minigun (MMG class), belt-fed full-auto. Rigger 2." },
  { name: "Ares Vanquisher Minigun", dmg: "10S", mode: "FA", ammoType: "belt", wt: 45, avail: "18/28 days", cost: 75000, index: 3.5, range: "gun", notes: "Heavy vehicle minigun (HMG class), belt-fed full-auto. Rigger 2." },
  { name: "Ares Vigilant Autocannon", dmg: "18D", mode: "SS/FA", ammoType: "belt", wt: 90, avail: "20/45 days", cost: 100000, index: 5, range: "autocannon", notes: "Belt-fed vehicle autocannon; single-shot or full-auto. Rigger 2." },
  { name: "Ares Victory Autocannon", dmg: "20D", mode: "SS/FA", ammoType: "belt", wt: 105, avail: "20/45 days", cost: 125000, index: 5, range: "autocannon", notes: "Heavy belt-fed vehicle autocannon; single-shot or full-auto. Rigger 2." },
  // --- Missile launcher + missiles ---
  { name: "Man-Portable Missile Launcher", conceal: 6, dmg: "—", mode: "SS", ammo: 1, ammoType: "missile", wt: 8, avail: "18/28 days", cost: 12500, index: 4, range: "none", notes: "Shoulder-fired/hardpoint missile launcher; fires one missile per shot (load a missile below). Rigger 2 p.93." },
  { name: "AIM-11R Missile", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 90, avail: "GM's discretion", cost: 25000, index: 5, range: "none", notes: "Anti-air missile, Intelligence 6 guidance; fired from a missile launcher. Rigger 2." },
  { name: "Outlaw Missile (Block I, ICM)", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 15000, index: 5, range: "none", notes: "Outlaw vehicle missile, improved conventional munition (ICM); Intelligence 5. Rigger 2 p.93." },
  { name: "Outlaw Missile (Block IA, DP-ICM)", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 25000, index: 5, range: "none", notes: "Outlaw missile, dual-purpose improved conventional munition (DP-ICM, anti-armor + anti-personnel shaped charges); Intelligence 5. Rigger 2 p.93." },
  { name: "Outlaw Missile (Block II)", dmg: "20D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 35000, index: 5, range: "none", notes: "Outlaw missile, single high-explosive warhead; Intelligence 6. Rigger 2 p.93." },
  { name: "Vogeljäger Missile", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 17, avail: "18/28 days", cost: 5000, index: 4, range: "none", notes: "Light man-portable anti-air missile; Intelligence 5. Rigger 2 p.93." },
  // --- Mines / rockets ---
  { name: "Trapdoor Smart Mine", conceal: 8, dmg: "14D", mode: "SS", ammo: 3, ammoType: "mine", wt: 15, avail: "14/21 days", cost: 10000, index: 4, range: "none", notes: "Sensor-guided smart anti-vehicle mine; fires an explosively-formed penetrator (Rating 4 sensor / Rating 2 Pilot). Rigger 2." },
  { name: "RASCAM (Rocket-Assisted Smart Mines)", dmg: "14D", mode: "SS", ammo: 8, ammoType: "mine", wt: 160, avail: "14/21 days", cost: 100000, index: 4, range: "none", notes: "Rocket-deployed cluster of 8 Trapdoor smart mines; Intelligence 4. Rigger 2." },
  { name: "Zapper Static-Discharge Rocket", dmg: "16D", mode: "SS", ammo: 1, ammoType: "rocket", wt: 25, avail: "10/14 days", cost: 2500, index: 2.5, range: "zapper", notes: "Static-discharge rocket — overloads a target drone's electronics on impact rather than destroying it outright. Rigger 2." },
  // --- Electronic-warfare munitions (Jabberwocky jammers, Silencer AARM) ---
  { name: "Jabberwocky Jammer Rocket", dmg: "Special", mode: "SS", ammo: 1, ammoType: "rocket", wt: 200, avail: "12/21 days", cost: 9000, index: 5, range: "jabberwocky", notes: "Unguided rocket that scatters electronic-warfare jamming transponders over an area rather than dealing damage — fouls sensors, radios, and remote-control links. Rigger 2." },
  { name: "Jabberwocky Jammer Missile", dmg: "Special", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "12/21 days", cost: 14000, index: 5, range: "jabberwocky", notes: "Guided jammer missile (Intelligence 3) — delivers electronic-warfare jamming transponders to a chosen target area. Rigger 2." },
  { name: "Silencer AARM", dmg: "16D", mode: "SS", ammo: 1, ammoType: "missile", wt: 250, avail: "16/28 days", cost: 25000, index: 5, range: "none", notes: "Anti-radiation missile (Intelligence 5) that homes on a target's sensor/ECM emissions; resolved with the missile-combat rules. Rigger 2." }
];

let n = 0;
for (const w of WEAPONS) {
  const safe = w.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(w.name)}.json`, JSON.stringify(weapon(w), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} vehicle weapons`);
