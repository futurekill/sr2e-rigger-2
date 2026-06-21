// Generate Rigger 2 sensors & ECM gear into packs-src/r2-sensors (Item type
// "gear", category "electronics"). These are the EXTERNAL / carried versions of
// the remote-control electronic-warfare modules (weight-based, generally cheaper
// than the implanted cyber versions in r2-cyberware). Stats from the New Toys
// gear table (book p.98, verified against the page render). GearData has no
// streetIndex field, so the Street Index is recorded in notes. Rated items store
// a representative R1 cost with the per-rating formula in notes (SSC convention).
// Re-run, then `npm run build-packs r2-sensors`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-sensors";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-sensor:" + s).digest("hex").slice(0, 16);

function gear(g) {
  const _id = idFor(g.name);
  return {
    _id, name: g.name, type: "gear", img: g.img ?? "icons/svg/chip.svg",
    system: {
      category: g.category ?? "electronics", rating: g.rating ?? 0, quantity: 1,
      weight: g.weight ?? 0, cost: g.cost ?? 0,
      availability: g.avail ?? "", legality: g.legality ?? "Restricted",
      equipped: false, concealability: 0,
      weaponAccessory: false, linkedWeaponId: "", combatTnMod: 0,
      accessoryRecoilComp: 0, requiresSmartgun: false,
      notes: g.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const GEAR = [
  // --- External remote-control electronic-warfare gear (book p.98 table) ---
  { name: "Remote Control Encryption Module (External)", weight: 0.5, rating: 1, cost: 5000, avail: "(Rating)/(Rating) days", legality: "Restricted",
    notes: "Carried encryption unit for a remote-control deck (Rating 1–10). Cost = Rating × 5,000¥. Street Index 3. The external counterpart of the implanted module. Rigger 2." },
  { name: "Rigger Decryption Module (External)", weight: 0.5, rating: 1, cost: 7500, avail: "(Rating+2)/(Rating) days", legality: "Forbidden",
    notes: "Carried unit that cracks encrypted remote-control traffic (Rating 1–10). Cost = Rating × 7,500¥. Street Index 3. Rigger 2." },
  { name: "Remote Control ECCM (External)", weight: 1.5, rating: 1, cost: 7500, avail: "4/7 days", legality: "Restricted",
    notes: "Carried electronic counter-countermeasures for a remote-control deck. Tiers: R1–3 (1.5 kg, ×7,500¥, 4/7 days, SI 2); R4–6 (2 kg, ×15,000¥, 6/14 days, SI 3); R7–9 (2.5 kg, ×35,000¥, 12/28 days, SI 4); R10 (2.5 kg, 500,000¥ flat, 18/45 days). Rigger 2." },
  { name: "Rigger Protocol Emulation Module (External)", weight: 0.5, rating: 1, cost: 5000, avail: "(Rating+2)/(Rating) days", legality: "Forbidden",
    notes: "Carried unit that emulates another deck's control protocols to seize foreign drones (Rating 1–10). Cost = Rating × 5,000¥. Street Index 2. Rigger 2." },
  { name: "Signal Amplifier", weight: 1, rating: 1, cost: 250, avail: "(Rating)/(Rating × 12) hours", legality: "Legal",
    notes: "Boosts a remote-control signal's range (Rating 1–10). Weight = 1 × Rating kg; cost = Rating × 250¥. Street Index 1.5. Rigger 2." },
  { name: "Storage Memory", weight: 1, rating: 0, cost: 5, avail: "2/24 hours", legality: "Legal",
    notes: "Removable mass-storage for a remote-control deck. Cost = Mp × 5¥ (per megapulse). Street Index 1. Rigger 2." }
];

let n = 0;
for (const g of GEAR) {
  const safe = g.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(g.name)}.json`, JSON.stringify(gear(g), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} sensors/ECM gear`);
