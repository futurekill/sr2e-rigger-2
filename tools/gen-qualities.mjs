// Generate the Rigger 2 NEW Edges & Flaws into packs-src/r2-qualities (Item type
// "quality", added to the SR2E system). Book p.14-15 defines a handful of new
// rigger qualities; the others discussed there (Adrenaline Surge, Bio-Rejection,
// Blind, Deaf, Night Vision/Blindness) are Shadowrun Companion qualities that
// Rigger 2 only annotates for rigging — out of scope here. pointValue stores the
// base/lowest tier; tiers + effects are summarised in notes (original wording).
// Re-run, then `npm run build-packs r2-qualities`.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-qualities";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-quality:" + s).digest("hex").slice(0, 16);

const fileFor = (q) => `${DIR}/${q.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "")}_${idFor(q.name)}.json`;
// Keep the art already wired into a file (re-running must never un-wire it).
const keptImg = (q) => existsSync(fileFor(q)) ? JSON.parse(readFileSync(fileFor(q), "utf8")).img : null;

function quality(q) {
  const _id = idFor(q.name);
  const icon = q.kind === "edge" ? "icons/svg/upgrade.svg" : "icons/svg/downgrade.svg";
  return {
    _id, name: q.name, type: "quality", img: keptImg(q) ?? q.img ?? icon,
    system: {
      kind: q.kind, category: q.category, pointValue: q.value, rule: q.rule,
      source: q.source ?? "Rigger 2 p.15", notes: q.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

// Notes are the book's rules in short (p.15–16); the system applies them by `rule` (Phase 2 Part 2b).
const QUALITIES = [
  { name: "Computer Illiterate", kind: "flaw", category: "skill", value: -3, rule: "computer-illiterate", source: "Rigger 2 p.15",
    notes: "<p>Extreme difficulty with computers and other electronic devices: +1 to the target number of every test that involves a computer or electronic device in any way (riggers and deckers too; a mage reading an electronic hermetic library). The gamemaster may also require Success Tests (Target Number 2 or 3) for everyday tasks such as using an unfamiliar telecom.</p>" },
  { name: "Sensitive Neural Structure", kind: "flaw", category: "mental", value: -2, rule: "sensitive-neural-structure", source: "Rigger 2 p.15",
    notes: "<p>Value −2 or −4. When resisting neural damage (BTLs, black IC, rigger dump shock and other damaging simsense), effective Willpower is reduced by 1 (−2 Flaw) or 2 (−4 Flaw), never below 1.</p>" },
  { name: "Simsense Vertigo", kind: "flaw", category: "mental", value: -2, rule: "simsense-vertigo", source: "Rigger 2 p.15",
    notes: "<p>Disoriented by cyberdecks, vehicle control rigs, simrigs, smartlinks, display links and other simsense technology: +1 to all target numbers and −1 Initiative while operating any simsense-related device.</p>" },
  { name: "Spike Resistance", kind: "edge", category: "mental", value: 2, rule: "spike-resistance", source: "Rigger 2 p.15",
    notes: "<p>Value 2 or 4. When resisting high simsense spikes and harmful ASIST (black IC, rigger dump shock), effective Willpower +1 for every 2 points of Spike Resistance.</p>" },
  { name: "Gremlins", kind: "flaw", category: "other", value: -1, rule: "gremlins", source: "Rigger 2 p.15",
    notes: "<p>Value −1 to −4. Whenever the character handles a piece of equipment, roll 2D6: on a 2 it breaks down.</p><ul><li><b>1 point:</b> +1 or −1 against the character on Success Tests and effect values (Power, Flux, MPCP…); a Simple Action banging it on a hard surface makes it work normally during the character's next Combat Phase.</li><li><b>2 points:</b> it doesn't work; a sharp jolt (Simple Action) brings it back on-line in the character's next Combat Turn.</li><li><b>3 points:</b> major malfunction, +2 or −2 against the character until repaired (cost × 0.2 plus labour).</li><li><b>4 points:</b> breaks down; only a major overhaul fixes it (cost × 0.5 plus labour).</li></ul><p>Driving a vehicle: one major subsystem or modification goes down (the gamemaster rolls or picks). No effect on cyberware, bioware or magical equipment; hermetic libraries on electronic media can be hit.</p>" },
  { name: "Vehicle Empathy", kind: "edge", category: "other", value: 2, rule: "vehicle-empathy", source: "Rigger 2 p.16",
    notes: "<p>Whenever the character is in physical contact with a vehicle (manual controls, or jacked into the vehicle itself), reduce its Handling by 1.</p>" }
];

let n = 0;
for (const q of QUALITIES) {
  writeFileSync(fileFor(q), JSON.stringify(quality(q), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} qualities`);
