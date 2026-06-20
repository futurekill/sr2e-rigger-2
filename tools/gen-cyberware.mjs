// Generate Rigger 2 rigger cyberware into packs-src/r2-cyberware.
// Stats from the New Toys cyberware table (book p.96, verified against the page
// render). Rated items store a representative cost with the per-rating formula
// in notes (matching the SSC convention). Descriptions are original one-liners.
// Re-run, then `npm run build-packs r2-cyberware`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-cyberware";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-cyber:" + s).digest("hex").slice(0, 16);
const ZERO = { body: 0, quickness: 0, strength: 0, charisma: 0, intelligence: 0, willpower: 0, reaction: 0, initiativeDice: 0 };

function cyber(c) {
  const _id = idFor(c.name);
  return {
    _id, name: c.name, type: "cyberware", img: c.img ?? "icons/svg/upgrade.svg",
    system: {
      location: c.location ?? "headware", grade: "standard",
      essenceCost: c.ess ?? 0, rating: c.rating ?? 0,
      cost: c.cost ?? 0, availability: c.avail ?? "", streetIndex: String(c.index ?? ""),
      legality: c.legality ?? "Restricted", installed: false, combatTnMod: 0, isVcr: false,
      attributeMods: { ...ZERO },
      notes: c.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const CYBER = [
  { name: "Remote Control Deck", location: "headware", ess: 0.3, rating: 1, cost: 25000, avail: "4/72 hrs", index: 2, legality: "Restricted", notes: "Implanted remote-control deck — jump into and pilot drones and vehicles by wire. Cost = Rating × 25,000¥. Rigger 2." },
  { name: "BattleTac IVIS Master Unit (CRD)", location: "headware", ess: 0.15, cost: 150000, avail: "8/14 days", index: 3, legality: "Restricted", notes: "Cranial master unit coordinating a BattleTac IVIS tactical network. Rigger 2." },
  { name: "BattleTac FDDM Master Unit (CRD)", location: "headware", ess: 0.15, cost: 200000, avail: "10/21 days", index: 3, legality: "Restricted", notes: "Cranial master unit for a BattleTac FDDM tactical network. Rigger 2." },
  { name: "Remote Control Encryption Module", location: "headware", ess: 0.2, rating: 1, cost: 10000, avail: "varies (Rating-based)", index: 3, legality: "Restricted", notes: "Encrypts a remote-control deck's signals (Rating 1–10). Cost = Rating × 10,000¥; availability scales with Rating. Rigger 2." },
  { name: "Rigger Decryption Module", location: "headware", ess: 0.2, rating: 1, cost: 17500, avail: "varies (Rating-based)", index: 3, legality: "Forbidden", notes: "Cracks encrypted remote-control traffic (Rating 1–10). Cost = Rating × 17,500¥. Rigger 2." },
  { name: "Remote Control ECCM", location: "headware", ess: 0.2, rating: 1, cost: 15000, avail: "4/7 days", index: 2, legality: "Restricted", notes: "Electronic counter-countermeasures for a remote-control deck. Tiers: R1–3 (Ess 0.2, ×15,000¥, 4/7 days, SI 2); R4–6 (0.3, ×35,000¥, 6/14 days, SI 3); R7–9 (0.4, ×75,000¥, 12/28 days, SI 4); R10 (0.45, 900,000¥ flat, 18/45 days). Rigger 2." },
  { name: "Rigger Protocol Emulation Module", location: "headware", ess: 0.45, rating: 1, cost: 5000, avail: "varies (Rating-based)", index: 2, legality: "Forbidden", notes: "Lets a rigger emulate another deck's control protocols to seize foreign drones. Cost = Rating × 5,000¥. Rigger 2." },
  { name: "Cyberlimb Signal Booster", location: "cyberlimb", ess: 0, rating: 1, cost: 15000, avail: "6/72 hrs", index: 1.5, legality: "Restricted", notes: "Extends remote-control signal range; installed in a cyberlimb and uses the limb's capacity (table lists no separate Essence — confirm). Cost = Rating × 15,000¥. Rigger 2." },
  { name: "Snake-Eyes Remote Interface Link", location: "headware", ess: 1.0, cost: 150000, avail: "6/12 days", index: 2.5, legality: "Restricted", notes: "High-end remote interface link blending remote control with the user's own senses. Rigger 2." },
  { name: "Snake-Eyes FDDM Link", location: "headware", ess: 1.0, cost: 70000, avail: "10/21 days", index: "", legality: "Restricted", notes: "Snake-Eyes interface link for an FDDM network. Street Index illegible in the source scan — pending a physical-book capture. Rigger 2." }
];

let n = 0;
for (const c of CYBER) {
  const safe = c.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(c.name)}.json`, JSON.stringify(cyber(c), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} cyberware items`);
