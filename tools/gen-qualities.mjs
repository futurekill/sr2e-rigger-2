// Generate the Rigger 2 NEW Edges & Flaws into packs-src/r2-qualities (Item type
// "quality", added to the SR2E system). Book p.14-15 defines a handful of new
// rigger qualities; the others discussed there (Adrenaline Surge, Bio-Rejection,
// Blind, Deaf, Night Vision/Blindness) are Shadowrun Companion qualities that
// Rigger 2 only annotates for rigging — out of scope here. pointValue stores the
// base/lowest tier; tiers + effects are summarised in notes (original wording).
// Re-run, then `npm run build-packs r2-qualities`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-qualities";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-quality:" + s).digest("hex").slice(0, 16);

function quality(q) {
  const _id = idFor(q.name);
  const icon = q.kind === "edge" ? "icons/svg/upgrade.svg" : "icons/svg/downgrade.svg";
  return {
    _id, name: q.name, type: "quality", img: q.img ?? icon,
    system: {
      kind: q.kind, category: q.category, pointValue: q.value,
      source: q.source ?? "Rigger 2 p.15", notes: q.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const QUALITIES = [
  { name: "Computer Illiterate", kind: "flaw", category: "skill", value: -3, source: "Rigger 2 p.15",
    notes: "The character has extreme difficulty with computers and other electronics, suffering a +1 target-number modifier to all tests involving computer or electronic devices (which for a rigger includes piloting drones and decks)." },
  { name: "Sensitive Neural Structure", kind: "flaw", category: "mental", value: -2, source: "Rigger 2 p.15",
    notes: "The character is unusually vulnerable to neural damage — BTL chips, black IC, rigger drain, and dump shock. Reduce Willpower by 1 (at value −2) or 2 (at value −4) when resisting such damage. Tiered: −2 or −4." },
  { name: "Simsense Vertigo", kind: "flaw", category: "mental", value: -2, source: "Rigger 2 p.15",
    notes: "Simsense and direct-neural cyber-interfaces leave the character disoriented; apply a +1 target-number modifier to all simsense-related tests (rigging, BTL, etc.)." },
  { name: "Spike Resistance", kind: "edge", category: "mental", value: 2, source: "Rigger 2 p.15",
    notes: "The character shrugs off harsh ASIST spikes and dump shock: add 1 (at value +2) or 2 (at value +4) to Willpower when resisting spike/dump-shock damage. Tiered: +2 or +4." },
  { name: "Gremlins", kind: "flaw", category: "other", value: -1, source: "Rigger 2 p.15",
    notes: "The character's gear is temperamental. On a 1 (rolled on 2D6 against a target number set by the flaw's value), a piece of equipment glitches — operating at a +1 modifier (1-point flaw), needing a Simple/Complex Action to clear, or failing for the scene at worse tiers. Tiered: −1, −2, −3, or −4 (higher = more frequent/severe)." }
];

let n = 0;
for (const q of QUALITIES) {
  const safe = q.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(q.name)}.json`, JSON.stringify(quality(q), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} qualities`);
