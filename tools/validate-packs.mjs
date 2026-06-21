// Pre-flight validator for the Rigger 2 packs (QA-PLAN §0). Runs with no
// Foundry: checks every packs-src/*/*.json document for valid JSON, required
// keys, correct _key form, and duplicate _ids; reports per-pack counts. Exits
// non-zero if anything fails. Run: `node tools/validate-packs.mjs`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "packs-src";
const ACTOR_PACKS = new Set(["r2-vehicles"]); // packs whose docs are Actors
let problems = 0;
const note = (m) => { console.error("  ✗ " + m); problems++; };

let packs;
try { packs = readdirSync(ROOT).filter((p) => statSync(join(ROOT, p)).isDirectory()); }
catch { console.error(`no ${ROOT}/ directory`); process.exit(1); }

for (const pack of packs.sort()) {
  const dir = join(ROOT, pack);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const ids = new Map();
  const collection = ACTOR_PACKS.has(pack) ? "actors" : "items";
  console.log(`\n${pack}  (${files.length} docs, expecting !${collection}!…)`);

  for (const f of files) {
    const path = join(dir, f);
    let doc;
    try { doc = JSON.parse(readFileSync(path, "utf8")); }
    catch (e) { note(`${f}: invalid JSON — ${e.message}`); continue; }

    for (const k of ["_id", "_key", "name", "type", "system"]) {
      if (doc[k] === undefined) note(`${f}: missing "${k}"`);
    }
    if (doc._id && doc._key && doc._key !== `!${collection}!${doc._id}`) {
      note(`${f}: _key "${doc._key}" should be "!${collection}!${doc._id}"`);
    }
    if (doc._id) {
      if (ids.has(doc._id)) note(`${f}: duplicate _id with ${ids.get(doc._id)}`);
      else ids.set(doc._id, f);
    }
    if (doc.system && typeof doc.system !== "object") note(`${f}: system is not an object`);
  }
}

if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("\nAll packs valid.");
