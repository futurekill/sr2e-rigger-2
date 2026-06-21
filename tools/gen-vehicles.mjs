// Generate Rigger 2 vehicles & drones into packs-src/r2-vehicles (Actor type
// "vehicle"). Stats from the New Toys "Drones and Robots" stat blocks (book
// p.100-101, verified against the page renders). Descriptions are original
// one-liners — no book prose. Re-run, then `npm run build-packs r2-vehicles`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-vehicles";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-vehicle:" + s).digest("hex").slice(0, 16);

function vehicle(v) {
  const _id = idFor(v.name);
  const img = v.img ?? "icons/svg/explosion.svg";
  return {
    _id, name: v.name, type: "vehicle", img,
    system: {
      vehicleType: v.vtype ?? "drone", skill: v.skill ?? "",
      handling: v.handling, speed: v.speed, acceleration: v.accel ?? 0,
      body: v.body, armor: v.armor, signature: v.sig,
      pilot: v.pilot ?? 0, sensor: v.sensor ?? 0,
      cargo: v.cargo ?? 0, load: v.load ?? 0, seating: v.seating ?? "",
      cost: v.cost ?? 0, availability: v.avail ?? "", autonav: v.autonav ?? 0,
      conditionMonitor: { value: 0, max: 10 },
      notes: v.notes ?? ""
    },
    items: [], effects: [], folder: null, sort: 0, flags: {},
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    prototypeToken: {
      name: v.name, displayName: 0, actorLink: false, width: 1, height: 1,
      texture: { src: img, anchorX: 0.5, anchorY: 0.5, scaleX: 1, scaleY: 1, fit: "contain", tint: "#ffffff" },
      disposition: 0, displayBars: 0
    },
    ownership: { default: 0 }, _key: `!actors!${_id}`
  };
}

const VEHICLES = [
  // --- New Toys: Drones & Robots (book p.100-101) ---
  { name: "Aeroquip Redball Express", vtype: "drone", handling: 4, speed: 300, accel: 35, body: 3, armor: 0, sig: 5, pilot: 2, sensor: 3, cargo: 16, load: 150, seating: "0", cost: 25000,
    notes: "Long-range autonomous resupply drone — VTOL, jet-powered, hauls ammunition and supplies to forces in the field. Cargo 16 CF; fuel jet (250 L), economy 0.25 km/L. Remote control interface + rigger adaptation. Rigger 2." },
  { name: "Aerodesign Condor LDSD-23", vtype: "drone", handling: 4, speed: 60, accel: 3, body: 2, armor: 0, sig: 10, pilot: 1, sensor: 1, cargo: 1, load: 50, seating: "0", cost: 3325,
    notes: "Solar-electric VTOL recon drone — a stealthy, long-endurance eye in the sky (SunCell solar generators drop economy to 0 on sunny days). Cargo 1 CF. Remote control interface + rigger adaptation. Rigger 2." },
  { name: "Aerodesign Condor II LDSD-41", vtype: "drone", handling: 4, speed: 90, accel: 5, body: 2, armor: 3, sig: 10, pilot: 3, sensor: 1, cargo: 3, load: 50, seating: "0", cost: 36000,
    notes: "Improved Condor recon drone — SHAPELY enhanced-lift airfoil, extended-duration batteries, faster and tougher than the LDSD-23. Cargo 3 CF. Remote control interface + rigger adaptation. Rigger 2." },
  { name: "Ares Arms Sentry II", vtype: "drone", handling: 3, speed: 0, accel: 0, body: 2, armor: 0, sig: 4, pilot: 4, sensor: 4, cargo: 1, load: 250, seating: "0", cost: 30000,
    notes: "Stationary automated weapons stand that behaves like a drone — a micro-turret with anti-aircraft capability (weapon not included). BattleTac-compatible; can multiply the team's firepower. Remote control interface. Rigger 2." }
];

let n = 0;
for (const v of VEHICLES) {
  const safe = v.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(v.name)}.json`, JSON.stringify(vehicle(v), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} vehicles/drones`);
