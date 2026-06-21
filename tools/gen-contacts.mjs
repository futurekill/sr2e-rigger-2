// Generate Rigger 2 contact archetypes into packs-src/r2-contacts (Item type
// "contact"). Book p.19 describes "The Mechanic" as a rigger's specialist
// contact (services scale by connection level). It's an archetype writeup, not a
// stat-blocked NPC, so it ships as a reusable contact template a player drags
// onto their sheet and sets loyalty/influence. Re-run, then
// `npm run build-packs r2-contacts`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/r2-contacts";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("r2-contact:" + s).digest("hex").slice(0, 16);

function contact(c) {
  const _id = idFor(c.name);
  return {
    _id, name: c.name, type: "contact", img: c.img ?? "icons/svg/wrench.svg",
    system: {
      contactType: "contact", archetype: c.archetype ?? c.name,
      loyalty: 1, influence: 1,
      description: c.description ?? "", notes: c.notes ?? ""
    },
    effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.0.1", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const CONTACTS = [
  { name: "Mechanic", archetype: "Mechanic",
    description: "<p>A rigger's specialist contact for vehicles and drones — sells gear and information, and handles vehicle repair and customization. The Mechanic's services scale with their connection level:</p><ul><li><strong>Level 1:</strong> repairs and basic modifications at parts cost; you supply the labor (or make your own Build/Repair test).</li><li><strong>Level 2:</strong> full repair &amp; customization at market labor rates, with 1–3 contacts and Friends-of-a-Friend to source parts and work.</li><li><strong>Level 3:</strong> as Level 2, plus overtime/rush jobs and reduced parts costs for trusted, well-liked riggers.</li></ul><p>Rigger 2 p.19.</p>",
    notes: "Set Loyalty/Influence to match the connection level you're using (1–3). Rigger 2 p.19." }
];

let n = 0;
for (const c of CONTACTS) {
  const safe = c.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  writeFileSync(`${DIR}/${safe}_${idFor(c.name)}.json`, JSON.stringify(contact(c), null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} contacts`);
