// Pre-flight validator for the Rigger 2 packs (QA-PLAN §0). Runs with no
// Foundry: checks every packs-src/*/*.json document for valid JSON, required
// keys, correct _key form, and duplicate _ids; reports per-pack counts. Exits
// non-zero if anything fails. Run: `node tools/validate-packs.mjs`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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

/** The system evaluator's grammar, as a structural check: tokens, balanced parentheses, operand/operator alternation. */
function formulaSyntaxOk(v) {
  const toks = v.replace(/\s+/g, "").match(/floor\(|ceil\(|min\(|max\(|\d+(\.\d+)?|EDP|EY|R0|R1|HO|A0|A1|S0|STR|[RBPCEKLVNHS]|[+\-x/^(),]/g);
  if (!toks || toks.join("") !== v.replace(/\s+/g, "")) return false;
  let depth = 0, wantOperand = true;
  for (const t of toks) {
    if (t.endsWith("(")) { if (!wantOperand) return false; depth++; continue; }
    if (t === ")") { if (wantOperand) return false; if (--depth < 0) return false; continue; }
    if (t === ",") { if (wantOperand || depth < 1) return false; wantOperand = true; continue; }
    if ("+-x/^".includes(t)) { if (wantOperand && t !== "-") return false; wantOperand = true; continue; }
    if (!wantOperand) return false;
    wantOperand = false;
  }
  return depth === 0 && !wantOperand;
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
  // Every vehicle mod's formulas use only R B P C E K L, numbers, + - x / ^ ( ) and floor/ceil.
  const modDir = join(ROOT, "r2-vehicle-mods");
  for (const f of readdirSync(modDir).filter(x => x.endsWith(".json"))) {
    const sys = JSON.parse(readFileSync(join(modDir, f), "utf8")).system ?? {};
    for (const k of ["dpFormula", "cfFormula", "loadFormula", "maxRating"]) {
      const v = sys[k] ?? "";
      if (v && !formulaSyntaxOk(v)) note(`${f}: ${k} "${v}" isn't a valid formula (R B P C E K L, numbers, + - x / ^ ( ) , floor ceil min max)`);
    }
    for (const t of sys.restrictions ?? []) {
      if (!/^(only|not|engine|notWith):[A-Za-z,-]+$|^(notDrone|needsEngineCustom|needsRemote|needsRiggerBase|notAircraftUnlessElectric)$|^minBody:\d+$/.test(t)) note(`${f}: unknown restriction "${t}"`);
    }
    if (typeof sys.designable !== "boolean") note(`${f}: designable must be true or false`);
    // Customization Specifications (system docs/PLAN-vehicle-customization.md C2).
    const cu = sys.custom ?? {};
    for (const [k, v] of Object.entries(cu.formulas ?? {})) {
      if (k === "baseUnit" || k === "set") continue;
      if (!/^(partsCost|tn|baseTime|cf|load)(@(bike|car|boat|fixedWing|rotor|vector|hovercraft|special|drone|transport|tractor|truck|zeppelin|electricAircraft))?$/.test(k)) note(`${f}: unknown customization formula "${k}"`);
      if (!formulaSyntaxOk(String(v))) note(`${f}: customization ${k} "${v}" isn't a valid formula`);
    }
    if (cu.max?.value != null && !formulaSyntaxOk(String(cu.max.value))) note(`${f}: customization maximum "${cu.max.value}" isn't a valid formula`);
    for (const r of cu.market ?? []) if (r.restricted && !["military", "unavailable"].includes(r.restricted)) note(`${f}: unknown market restriction "${r.restricted}"`);
    for (const [k, v] of Object.entries(sys.effects ?? {})) {
      if (!/^(handling|handlingOff|speed|acceleration|load|signature|armor|cargo|economyMult|speedMult|sensorSet|autonavSet|pilotSet)(@(bike|car|boat|fixedWing|rotor|vector|hovercraft|special|transport))?$/.test(k)) note(`${f}: unknown effect "${k}"`);
      if (!formulaSyntaxOk(String(v))) note(`${f}: effect ${k} "${v}" isn't a valid formula`);
    }
  }
  // The shipped copies (data/) must be the sources (tools/data/): the release excludes tools/.
  for (const f of ["design-chassis.json", "design-powerplants.json", "design-rules.json"]) {
    let shipped = null;
    try { shipped = readFileSync(join("data", f), "utf8"); } catch { /* missing */ }
    if (shipped !== readFileSync(join("tools/data", f), "utf8")) note(`data/${f} differs from tools/data/${f}: run npm run sync-design-data`);
  }
}

// The Vehicle List (system docs/PLAN-vehicle-list.md): ids the system knows, factory items from the catalog, identities
// that resolve to a shipped document.
{
  const TYPES = new Set(["ground", "hovercraft", "boat", "aircraft", "rotor", "vectored_thrust", "drone"]);
  const SKILLS = new Set(["bike", "car", "hovercraft", "motorboat", "sailboat", "rotor", "winged", "vectorThrust"]);
  const CATS = new Set(["bike", "car", "hovercraft", "boat", "rotor", "fixedWing", "vector", "special"]);
  const TRAITS = new Set(["zeppelin", "tractor", "truck", "drone", "electricAircraft"]);
  const ENGINES = new Set(["gasoline", "diesel", "electric", "methane", "jetPropeller", "jetTurbine", "sail"]);
  const weaponNames = new Set(readdirSync(join(ROOT, "r2-vehicle-weapons")).filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(join(ROOT, "r2-vehicle-weapons", f), "utf8")).name));
  const modNames = new Set(readdirSync(join(ROOT, "r2-vehicle-mods")).filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(join(ROOT, "r2-vehicle-mods", f), "utf8")).name));
  const list = JSON.parse(readFileSync("data/vehicle-list.json", "utf8"));
  for (const [vid, row] of Object.entries(list.rows)) {
    const s = row.system;
    if (!TYPES.has(s.vehicleType)) note(`vehicle list ${vid}: vehicleType "${s.vehicleType}"`);
    if (!SKILLS.has(s.skill)) note(`vehicle list ${vid}: skill "${s.skill}"`);
    if (!CATS.has(s.design.category)) note(`vehicle list ${vid}: category "${s.design.category}"`);
    for (const t of s.design.traits) if (!TRAITS.has(t)) note(`vehicle list ${vid}: trait "${t}"`);
    if (s.fuelType && !ENGINES.has(s.fuelType)) note(`vehicle list ${vid}: engine "${s.fuelType}"`);
    for (const k of ["handling", "speed", "acceleration", "body", "armor", "signature", "cargo", "load", "cost"]) if (!(Number(s[k]) >= 0)) note(`vehicle list ${vid}: ${k} ${s[k]}`);
    for (const i of row.factory) if (i.type === "weapon" ? !weaponNames.has(i.name) : !modNames.has(i.name) || i.system.custom?.state !== "factory") note(`vehicle list ${vid}: factory item "${i.name}"`);
  }
  const shipped = {}, found = new Set();   // found: the packages whose repo is checked out beside this one
  for (const dir of readdirSync("..").filter(d => d.startsWith("sr2e-"))) {
    let packsDir; try { packsDir = readdirSync(join("..", dir, "packs-src")); } catch { continue; }
    let pkg; try { pkg = JSON.parse(readFileSync(join("..", dir, existsSync(join("..", dir, "system.json")) ? "system.json" : "module.json"), "utf8")).id; } catch { continue; }
    found.add(pkg);
    for (const pack of packsDir) {
      let files; try { files = readdirSync(join("..", dir, "packs-src", pack)).filter(f => f.endsWith(".json")); } catch { continue; }
      for (const f of files) { try { const d = JSON.parse(readFileSync(join("..", dir, "packs-src", pack, f), "utf8")); if (d.type === "vehicle") shipped[`Compendium.${pkg}.${pack}.Actor.${d._id}`] = true; } catch { /* not a doc */ } }
    }
  }
  for (const [uuid, e] of Object.entries(list.identity)) {
    if (!list.rows[e.vehicleId]) note(`identity ${uuid}: unknown vehicleId ${e.vehicleId}`);
    if (found.has(uuid.split(".")[1]) && !shipped[uuid]) note(`identity ${uuid} (${e.name}) doesn't resolve to a shipped vehicle`);
  }
}

if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("\nAll packs valid.");
