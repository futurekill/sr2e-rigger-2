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
// Vehicle-weapon range brackets are on the R2 Weapon Ranges Table (p.107), not
// yet transcribed — these are placeholder heavy/long values pending that table.
const RANGE = {
  gun:  { short: 50, medium: 150, long: 350, extreme: 550 },
  none: { short: 0,  medium: 0,   long: 0,   extreme: 0 }
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
  { name: "Ares Vigilant Autocannon", dmg: "18D", mode: "SS/FA", ammoType: "belt", wt: 90, avail: "20/45 days", cost: 100000, index: 5, range: "gun", notes: "Belt-fed vehicle autocannon; single-shot or full-auto. Rigger 2." },
  { name: "Ares Victory Autocannon", dmg: "20D", mode: "SS/FA", ammoType: "belt", wt: 105, avail: "20/45 days", cost: 125000, index: 5, range: "gun", notes: "Heavy belt-fed vehicle autocannon; single-shot or full-auto. Rigger 2." },
  // --- Missile launcher + missiles ---
  { name: "Non-Portable Missile Launcher", conceal: 6, dmg: "—", mode: "SS", ammo: 1, ammoType: "missile", wt: 30, avail: "18/28 days", cost: 12500, index: 6, range: "none", notes: "Vehicle/hardpoint missile launcher; fires one missile per shot (load a missile below). Rigger 2." },
  { name: "AIM-11R Missile", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 90, avail: "GM's discretion", cost: 25000, index: 5, range: "none", notes: "Anti-air missile, Intelligence 6 guidance; fired from a missile launcher. Rigger 2." },
  { name: "Outlaw Missile (Block IA, ICM)", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 25000, index: 5, range: "none", notes: "Outlaw vehicle missile, improved cluster munition; Intelligence 5. Rigger 2." },
  { name: "Outlaw Missile (Block IA, DP-ICM)", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 25000, index: 5, range: "none", notes: "Outlaw missile, dual-purpose cluster munition (anti-armor + anti-personnel); Intelligence 5. Rigger 2." },
  { name: "Outlaw Missile (Block IB)", dmg: "20D", mode: "SS", ammo: 1, ammoType: "missile", wt: 200, avail: "20/30 days", cost: 35000, index: 5, range: "none", notes: "Outlaw missile, single high-explosive warhead; Intelligence 5. Rigger 2." },
  { name: "Outlaw Missile (Block II)", dmg: "14D", mode: "SS", ammo: 1, ammoType: "missile", wt: 17, avail: "18/28 days", cost: 0, index: 4, range: "none", notes: "Man-portable Outlaw missile; Intelligence 5. Cost illegible in the source scan — pending a physical-book capture. Rigger 2." },
  // --- Mines / rockets ---
  { name: "Trapdoor Smart Mine", conceal: 8, dmg: "14D", mode: "SS", ammo: 3, ammoType: "mine", wt: 15, avail: "14/21 days", cost: 10000, index: 4, range: "none", notes: "Sensor-guided smart anti-vehicle mine; fires an explosively-formed penetrator (Rating 4 sensor / Rating 2 Pilot). Rigger 2." },
  { name: "RASCAM (Rocket-Assisted Smart Mines)", dmg: "14D", mode: "SS", ammo: 8, ammoType: "mine", wt: 160, avail: "14/21 days", cost: 100000, index: 4, range: "none", notes: "Rocket-deployed cluster of 8 Trapdoor smart mines; Intelligence 4. Rigger 2." },
  { name: "Zapper Static-Discharge Rocket", dmg: "16D", mode: "SS", ammo: 1, ammoType: "rocket", wt: 25, avail: "10/14 days", cost: 2500, index: 2.5, range: "none", notes: "Static-discharge rocket — overloads a target drone's electronics on impact rather than destroying it outright. Rigger 2." }
];

let n = 0;
for (const w of WEAPONS) {
  const safe = w.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(w.name)}.json`, JSON.stringify(weapon(w), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} vehicle weapons`);
