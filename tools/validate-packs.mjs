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

// ── Vehicle design tables (docs/DESIGN-DATA-CHECK.md) ─────────────────────────────────────────────────────
{
  const load = (f) => JSON.parse(readFileSync(join("tools/data", f), "utf8"));
  const chassis = load("design-chassis.json").chassis, plants = load("design-powerplants.json").powerPlants;
  const rules = load("design-rules.json");
  console.log(`\ndesign tables  (${chassis.length} chassis, ${plants.length} power plants)`);
  const CATS = new Set(["bike", "car", "hovercraft", "boat", "rotor", "fixedWing", "vector", "special"]);
  const ENGINES = new Set(["electric", "methane", "gasoline", "diesel", "jetPropeller", "jetTurbine", "sail"]);
  // A cell is a number, null, or a Body formula: digits, B, + - x ( ) ^ . and spaces only.
  const cellOk = (v) => v === null || typeof v === "number" || (typeof v === "string" && /^[\dB\s+\-x().^]+$/.test(v) && /B/.test(v));
  const keys = new Set();
  for (const c of chassis) {
    if (keys.has(c.key)) note(`chassis ${c.key}: duplicate key`); keys.add(c.key);
    if (!CATS.has(c.category)) note(`chassis ${c.key}: unknown category ${c.category}`);
    if (!c.page) note(`chassis ${c.key}: no page`);
    if (typeof c.dp !== "number") note(`chassis ${c.key}: Design Points must be a number`);
    for (const k of ["body", "armor", "sensor"]) if (typeof c[k] !== "number") note(`chassis ${c.key}: ${k} must be a number`);
    if (!(typeof c.handling === "number" || (typeof c.handling?.onRoad === "number" && typeof c.handling?.offRoad === "number"))) note(`chassis ${c.key}: bad handling`);
    if (typeof c.cargo?.start !== "number" || typeof c.cargo?.max !== "number") note(`chassis ${c.key}: bad cargo`);
  }
  const pkeys = new Set(), used = new Set();
  for (const p of plants) {
    if (pkeys.has(p.key)) note(`plant ${p.key}: duplicate key`); pkeys.add(p.key);
    if (!ENGINES.has(p.engine)) note(`plant ${p.key}: unknown engine ${p.engine}`);
    if (!p.chassis?.length) note(`plant ${p.key}: lists no chassis`);
    for (const k of p.chassis ?? []) { if (!keys.has(k)) note(`plant ${p.key}: unknown chassis ${k}`); used.add(k); }
    for (const [k, v] of [["speed.start", p.speed?.start], ["speed.max", p.speed?.max], ["speed.stall", p.speed?.stall ?? null],
      ["accel.start", p.acceleration?.start ?? null], ["accel.max", p.acceleration?.max ?? null], ["load.start", p.load?.start],
      ["load.max", p.load?.max], ["signature", p.signature], ["fuel", p.fuel?.size], ["dp", p.dp]]) {
      if (!cellOk(v ?? null)) note(`plant ${p.key}: ${k} "${v}" is neither a number nor a Body formula`);
    }
    if (p.dp == null) note(`plant ${p.key}: no Design Points`);
    if (p.engine !== "sail" && !rules.fuel[p.engine]) note(`plant ${p.key}: no Fuel Tank Capacity row for ${p.engine}`);
  }
  for (const k of keys) if (!used.has(k)) note(`chassis ${k}: no power plant lists it`);
  // The shipped copies (data/) must be the sources (tools/data/): the release excludes tools/.
  for (const f of ["design-chassis.json", "design-powerplants.json", "design-rules.json"]) {
    let shipped = null;
    try { shipped = readFileSync(join("data", f), "utf8"); } catch { /* missing */ }
    if (shipped !== readFileSync(join("tools/data", f), "utf8")) note(`data/${f} differs from tools/data/${f}: run npm run sync-design-data`);
  }
}

if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("\nAll packs valid.");
