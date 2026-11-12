// Generate the Rigger 2 Vehicle List (book p.148–166) into packs-src/r2-vehicles, and the runtime data the module's
// precedence hook and update window use (data/vehicle-list.json). System docs/PLAN-vehicle-list.md.
//   node tools/gen-vehicle-list.mjs            write
//   node tools/gen-vehicle-list.mjs --check    self-test of the row mapper, writes nothing
// Source rows: tools/data/vehicle-list.json (two agreeing transcriptions, docs/DESIGN-DATA-CHECK.md).
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

const MODULE_ID = JSON.parse(readFileSync("module.json", "utf8")).id;
const DIR = "packs-src/r2-vehicles";
const ROWS = JSON.parse(readFileSync("tools/data/vehicle-list.json", "utf8"));
const CHASSIS = Object.fromEntries(JSON.parse(readFileSync("tools/data/design-chassis.json", "utf8")).chassis.map(c => [c.key, c]));
const PLANTS = JSON.parse(readFileSync("data/design-powerplants.json", "utf8")).powerPlants;
const IDENTITY = JSON.parse(readFileSync("tools/data/vehicle-identity.json", "utf8"));
const IDS_FILE = "tools/data/vehicle-list-ids.json";

export const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const vehicleIdOf = (r) => slug(r.name + (r.variant ? " " + r.variant : ""));

/* ── Template → Workshop chassis (reviewed table; "Special" rows by vehicleId) ─────────────────────────────────── */
const TEMPLATE = {
  "4wd pickup": "pickup", "4wd van": "van", "apc": "apcWheeled", "all-terrain vehicle": "atv",
  "ambulance tilt-wing": "tiltWing", "ambulance utility helicopter": "utilityHelicopter", "ambulance van": "van",
  "armed ambulance tilt-wing": "tiltWing", "armed autogyro": "autogyro", "armed hovercraft": "hovercraftMedium",
  "armed skiff": "skiff", "armed sport cruiser": "sportCruiser", "armed sport variant": "sportCruiser",
  "armed twin-engine prop": "twinEngine", "armed ultralight prop": "ultralight", "armored sedan": "sedan",
  "armored heavy transport": "heavyTransport", "armored heavy transport ambulance": "heavyTransport",
  "armored medium hovercraft": "hovercraftMedium", "armored pickup": "pickup", "armored prisoner van": "van",
  "armored racing bike": "racingCycle", "armored sports car": "sportsCar", "armored turbine airliner": "airliner",
  "attack helicopter": "attackHelicopter", "cargo": "cargoHelicopter", "chopper": "chopper", "commuter": "subcompact",
  "electric van": "van", "flatbed": "pickup", "gasoline van": "van", "heavy transport": "heavyTransport",
  "jet fighter": "jetFighter", "jump jet fighter": "jumpJet", "large fixed wing uav": "fixedUavL",
  "large fixed-wing uav": "fixedUavL", "large hovercraft": "hovercraftLarge", "large tracked crawler": "crawlerLarge",
  "large walker": "walkerLarge", "lg. rotary-wing uav": "rotaryUavL", "lg. wheeled crawler": "crawlerLarge",
  "lg. wheeled drone": "crawlerLarge", "light hovercraft": "hovercraftSmall", "limousine": "limousine",
  "luxury rv": "rv", "luxury cargo": "cargoHelicopter", "luxury sedan": "sedan", "luxury sports car": "sportsCar",
  "luxury supercharged utility": "utilityHelicopter", "luxury twin-engine prop": "twinEngine",
  "luxury twin-engine turbine": "twinEngine", "luxury yacht": "yacht", "med. fixed-wing uav": "fixedUavM",
  "med. rotary-wing uav": "rotaryUavM", "med. tracked crawler": "crawlerSmall", "med. wheeled crawler": "crawlerSmall",
  "med. wheeled drone": "crawlerSmall", "medium hovercraft": "hovercraftMedium", "medium tracked crawler": "crawlerSmall",
  "medium transport": "mediumTransport", "medium transport ambulance": "mediumTransport",
  "medium wheeled crawler": "crawlerSmall", "micro-walker": "walkerMicro", "mini-blimp": "miniBlimp",
  "off-road": "offRoadBike", "pickup": "pickup", "prop airliner": "airliner", "rv": "rv", "racing bike": "racingCycle",
  "scooter": "scooter", "sedan": "sedan", "single-engine prop": "singleEngine", "skiff": "skiff",
  "sm. vectored-thrust uav": "vectorUavS", "sm.-vectored thrust uav": "vectorUavS", "small skimmer": "skimmerSmall",
  "special (train)": "tractor", "speedboat": "speedboat", "sport cruiser": "sportCruiser", "sports car": "sportsCar",
  "subcompact": "subcompact", "thunderbird": "thunderbird", "tilt-wing": "tiltWing", "tractor": "tractor",
  "twin-engine prop": "twinEngine", "ultralight": "ultralight", "utility": "utilityHelicopter", "van": "van",
  "water scooter": "waterScooter", "yacht": "yacht", "zeppelin": "zeppelin",
};
const SPECIAL = {
  "aeroquip-redball-express-long-range-resupply-drone": "vectorUavL", "ares-arms-sentry-ii": "crawlerSmall",
  "ares-sentinel-p-series-drone": "crawlerSmall", "mesametric-kodiak-roadway-clearance-system": "crawlerLarge",
  "nordkapp-conestoga-bergen-trailer": "heavyTransport",
};
// A per-row chassis where the template is ambiguous: the Hughes "Utility" is the utility helicopter, "Off-road" is a
// bike for the White Eagle and Offroader (both two-seat cycles, p.155, p.159).
const DRONE_CHASSIS = /^(crawler|rotaryUav|tiltWingUav|fixedUav|vectorUav|walker|rpv)/;

export function chassisFor(r) {
  const id = vehicleIdOf(r);
  const key = SPECIAL[id] ?? TEMPLATE[r.template.trim().toLowerCase()];
  if (!key || !CHASSIS[key]) throw new Error(`${id}: no chassis for template "${r.template}"`);
  return key;
}

/* ── Numbers ──────────────────────────────────────────────────────────────────────────────────────────────────── */
const n = (v) => { const m = String(v ?? "").replace(/(\d),(?=\d{3})/g, "$1").match(/-?\d*\.?\d+/); return m ? Number(m[0]) : 0; };
const dash = (v) => /^\s*(—|-|NA)?\s*$/.test(String(v ?? ""));
/** "x (y)" → {base x, alt y}; "a/b" → [a, b]. */
const paren = (v) => { const m = String(v).match(/^(.*?)\s*\((.*)\)\s*$/); return m ? { base: m[1], alt: m[2] } : { base: String(v), alt: null }; };
const parts = (v) => String(v).split("/").map(s => s.trim());

/* ── Engine (the design tables' ids) ─────────────────────────────────────────────────────────────────────────── */
const FUEL = [[/^elec/i, "electric"], [/^gas/i, "gasoline"], [/^diesel/i, "diesel"], [/^meth/i, "methane"], [/^sail/i, "sail"], [/^jet/i, "jet"]];
export function engineFor(fuelText, chassisKey, template) {
  const f = FUEL.find(([re]) => re.test(fuelText.trim()))?.[1] ?? "";
  if (f !== "jet") return f;
  const fits = new Set(PLANTS.filter(p => p.chassis.includes(chassisKey)).map(p => p.engine));
  if (fits.has("jetPropeller") && !fits.has("jetTurbine")) return "jetPropeller";
  if (fits.has("jetTurbine") && !fits.has("jetPropeller")) return "jetTurbine";
  return /prop|autogyro|rotor|helicopter|utility|cargo|tilt/i.test(template) ? "jetPropeller" : "jetTurbine";
}
function fuelFields(fuelText, engine) {
  const first = fuelText.split(/\/(?=[A-Z])|;\s*/)[0];
  const m = first.match(/\(?\s*([\d,.]+)\s*(liters?|PF|bars?)\s*\)?/i);
  const unit = m ? (/^l/i.test(m[2]) ? "liters" : /^b/i.test(m[2]) ? "bars" : "PF") : "";
  return { fuelType: engine, fuelSize: m ? n(m[1]) : 0, fuelUnit: unit };
}
function economyFields(text) {
  const idle = String(text).match(/\(\s*idle:?\s*([^)]*)\)/i)?.[1]?.trim() ?? "";
  const main = String(text).replace(/\(\s*idle[^)]*\)/i, "").trim();
  if (/^NA$/i.test(main) || !main) return { economy: 0, economyUnit: "", economyIdle: idle };
  const m = main.match(/([\d.]+)\s*(km|meters)\s*(?:\/|per)\s*(liter|ltr|PF|bar)/i);
  const unit = m ? `${m[2].toLowerCase() === "meters" ? "m" : "km"}/${/^l/i.test(m[3]) ? "liter" : m[3].toLowerCase() === "pf" ? "PF" : "bar"}` : "";
  return { economy: m ? Number(m[1]) : n(main), economyUnit: unit, economyIdle: idle };
}

/* ── Classification (system ids; validator checks them) ──────────────────────────────────────────────────────── */
const TYPE_BY_CATEGORY = { bike: "ground", car: "ground", hovercraft: "hovercraft", boat: "boat", rotor: "rotor",
  fixedWing: "aircraft", vector: "vectored_thrust", special: "ground" };
const SKILL_BY_CATEGORY = { bike: "bike", car: "car", hovercraft: "hovercraft", boat: "motorboat", rotor: "rotor",
  fixedWing: "winged", vector: "vectorThrust" };
const TRANSPORT = new Set(["mediumTransport", "heavyTransport", "tractor"]);
export function classify(r, chassisKey, engine) {
  const ch = CHASSIS[chassisKey];
  const drone = DRONE_CHASSIS.test(chassisKey) || /drone|uav|rpv|crawler/i.test(r.template) || (dash(r.seating) || /^none$/i.test(r.seating.trim())) && !dash(r.pilot);
  const zeppelin = chassisKey === "zeppelin" || chassisKey === "miniBlimp";
  const category = zeppelin ? "special" : chassisKey === "walkerMicro" || chassisKey === "walkerSmall" || chassisKey === "walkerLarge" || chassisKey === "anthroform" ? "special" : ch.category;
  const traits = [];
  if (zeppelin) traits.push("zeppelin");
  if (chassisKey === "tractor") traits.push("tractor");
  if (chassisKey === "mediumTransport" || chassisKey === "heavyTransport") traits.push("truck");
  if (drone) traits.push("drone");
  if (engine === "electric" && ["rotor", "fixedWing", "vector"].includes(ch.category)) traits.push("electricAircraft");
  const vehicleType = drone ? "drone" : zeppelin ? "aircraft" : TYPE_BY_CATEGORY[category] ?? "ground";
  const sail = engine === "sail";
  const skill = zeppelin ? "winged" : category === "boat" && sail ? "sailboat" : SKILL_BY_CATEGORY[category] ?? "car";
  return { vehicleType, skill, design: { category, transport: TRANSPORT.has(chassisKey) || !!ch.transport, traits } };
}

/* ── One row → VehicleData + notes ───────────────────────────────────────────────────────────────────────────── */
export function mapRow(r) {
  const notes = [];
  const chassisKey = chassisFor(r);
  const ch = CHASSIS[chassisKey];
  const ground = ["bike", "car", "special"].includes(ch.category) && !/hover|skimmer/.test(chassisKey);
  // Handling: ground "on/off"; "x (y)" alternate mode.
  const h = paren(r.handling);
  if (h.alt) notes.push(`Handling ${h.alt} when the alternate mode is used (Other Features).`);
  const hp = parts(h.base);
  const handling = n(hp[0]);
  const handlingOffRoad = hp.length > 1 && ground ? n(hp[1]) : null;
  // Speed: aircraft "stall/max" (p.22); "x (y)" alternate mode; anything else keeps the first.
  const s = paren(r.speed);
  if (s.alt) notes.push(`Speed ${s.alt} in the alternate mode (Other Features).`);
  const sp = parts(s.base);
  let speed = n(sp[0]), stallSpeed = 0;
  if (sp.length > 1) {
    if (["fixedWing", "vector", "rotor"].includes(ch.category) || /UAV/i.test(r.template) || chassisKey === "vectorUavL") { stallSpeed = n(sp[0]); speed = n(sp[1]); }
    else notes.push(`Printed Speed ${r.speed}.`);
  }
  const a = paren(r.accel);
  if (a.alt) notes.push(`Acceleration ${a.alt} in the alternate mode.`);
  if (/\//.test(a.base)) notes.push(`Printed Acceleration ${r.accel}.`);
  const sig = paren(r.sig);
  if (sig.alt) notes.push(`Signature ${sig.alt} in the alternate mode.`);
  if (/\//.test(sig.base)) notes.push(`Printed Signature ${r.sig}.`);
  const an = paren(r.autonav);
  if (an.alt) notes.push(`Autonav ${an.alt} in the alternate mode.`);
  // Cargo "a/b": two spaces, summed (plan: an inference; the split stays in the notes).
  const cp = parts(r.cargo);
  const cargo = cp.reduce((t, x) => t + n(x), 0);
  if (cp.length > 1) notes.push(`Cargo printed ${r.cargo} (two spaces; ${cargo} CF in all).`);
  const engine = engineFor(r.fuel, chassisKey, r.template);
  if (/\/(?=[A-Z])|;/.test(r.fuel)) notes.push(`Fuel: ${r.fuel} (the first is the primary fuel, p.24).`);
  const cls = classify(r, chassisKey, engine);
  const system = {
    vehicleType: cls.vehicleType, skill: cls.skill,
    handling, handlingOffRoad, speed, stallSpeed, acceleration: /NA/i.test(a.base) ? 0 : n(parts(a.base)[0]),
    body: n(r.body), armor: n(r.armor), signature: n(parts(sig.base)[0]),
    autonav: dash(an.base) ? 0 : n(an.base), pilot: dash(r.pilot) ? 0 : n(r.pilot), sensor: dash(r.sensor) ? 0 : n(r.sensor),
    cargo, load: n(r.load), seating: r.seating, entryPoints: r.entry, ltProfile: r.landing, setupTime: r.setup,
    ...fuelFields(r.fuel, engine), ...economyFields(r.economy),
    designPointValue: n(r.pointValue), cost: n(r.cost), otherFeatures: r.other,
    design: cls.design,
  };
  return { system, notes, chassisKey };
}

/* ── Factory equipment (plan: "Factory equipment"; level families one item with a rating, instances N items) ── */
const MOD = Object.fromEntries(readdirSync("packs-src/r2-vehicle-mods").filter(f => f.endsWith(".json"))
  .map(f => JSON.parse(readFileSync(`packs-src/r2-vehicle-mods/${f}`, "utf8"))).map(d => [d.name, d]));
const FEATURES = [ // [regex on one phrase, catalog item name, "level" | "set" | "instance", default rating]
  [/^turbocharging/i, "Turbocharging / Superconductive Drive", "level"],
  [/^thermal baffles/i, "Thermal Baffles", "level"],
  [/^radar[- ]absorbent materials?/i, "Radar-Absorbent Materials (RAM)", "level"],
  [/^ecm\b/i, "Electronic Countermeasures (ECM)", "set"],
  [/^eccm\b/i, "Electronic Counter-Countermeasures (ECCM)", "set"],
  [/^anti-theft system/i, "Anti-Theft System", "level"],
  [/^concealed armor/i, "Concealed Vehicle Armor", "armor"],
  [/^remote[- ]control interface/i, "Remote-Control Interface", "instance"],
  [/^rigger adaptation/i, "Rigger Adaptation", "instance"],
  [/^(?:external )?fixed (?:external )?hardpoints?|^external (?:fixed )?hardpoints?/i, "Fixed Mount (External Hardpoint)", "instance"],
  [/^external fixed firmpoints?|^external firmpoints?/i, "Fixed Mount (External Firmpoint)", "instance"],
  [/^(?:external )?missile mounts?|^external missile mounts?/i, "External Missile/Rocket Mount", "instance"],
  [/^pintle mounts?/i, "Pintle Mount", "instance"],
  [/^ring mounts?/i, "Ring Mount", "instance"],
  [/^micro-turrets?/i, "Remote Turret (Micro)", "instance"],
  [/^mini-turrets?/i, "Turret (Mini)", "instance"],
  [/^small remote turret/i, "Remote Turret (Small)", "instance"],
  [/^medium remote turret/i, "Remote Turret (Medium)", "instance"],
  [/^small turrets?/i, "Turret (Small)", "instance"],
  [/^medium turrets?/i, "Turret (Medium)", "instance"],
  [/^enviroseal \(gas\)/i, "EnviroSeal (Gas Seal)", "instance"],
  [/^apps\b/i, "Advanced Passenger Protection System (APPS)", "instance"],
  [/^roll bars/i, "Roll Bars", "instance"],
  [/^gridlink/i, "GridLink Power", "instance"],
  [/^suncell/i, "SunCell Power", "instance"],
  [/^electronics port/i, "Electronics Port", "instance"],
  [/^life support/i, "Life Support System", "instance"],
  [/^hovercraft water seals/i, "Hovercraft Water Seals", "instance"],
  [/^flotation package/i, "Floatation Package (Aircraft)", "instance"],
  [/^(?:\d+ )?mechanical arms?/i, "Mechanical Arms", "instance"],
  [/^spotlight/i, "Spotlight", "instance"],
  [/^battletac fddm/i, "BattleTac FDDM Receiver Module", "instance"],
  [/^amphibious operation/i, "amphibious", "amphibious"],
];
// Weapons a feature includes ("hardpoint (with Vanquisher minigun and 1,000 rounds ammo)"); "not included" ones aren't created.
const WEAPONS = [[/vanquisher minigun/i, "Ares Vanquisher Minigun"]];
const WEAPON = Object.fromEntries(readdirSync("packs-src/r2-vehicle-weapons").filter(f => f.endsWith(".json"))
  .map(f => JSON.parse(readFileSync(`packs-src/r2-vehicle-weapons/${f}`, "utf8"))).map(d => [d.name, d]));
/** Split "Other Features" on commas outside parentheses. */
export function phrases(text) {
  const out = []; let depth = 0, cur = "";
  for (const c of String(text)) {
    if (c === "(") depth++; if (c === ")") depth = Math.max(0, depth - 1);
    if (c === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(p => p && !/^none\.?$/i.test(p));
}
/** The factory items for a row: [{name, rating, count}] (variant-qualified phrases only for their variant). */
export function factoryFor(r, system) {
  const out = [], unmapped = [];
  for (let p of phrases(r.other)) {
    const q = p.match(/\(([^)]*)\)\s*$/)?.[1] ?? "";
    // "(armed only)", "(LDSD-23)", "(factored in—turbo variant)": only that variant; "(both)" all.
    const only = q.match(/^(\w[\w .-]*) only$/i)?.[1] ?? (/^(LDSD-\d+)$/.test(q) ? q : q.match(/turbo variant/i) ? "Turbo" : null);
    if (only && r.variant && !r.variant.toLowerCase().startsWith(only.toLowerCase().replace(/ variant$/, ""))) continue;
    if (only && !r.variant) continue;
    const count = Number(p.match(/^(\d+)\s+(?!km|kg)/)?.[1] ?? 1);
    const body = p.replace(/^\d+\s+/, "");
    const w = /\(with ([^)]*)\)/i.exec(body)?.[1];
    const wf = w && WEAPONS.find(([re]) => re.test(w));
    if (wf) {
      if (!WEAPON[wf[1]]) throw new Error(`${vehicleIdOf(r)}: weapon catalog has no "${wf[1]}"`);
      out.push({ name: wf[1], weapon: true, rating: 1, count: 1, rounds: Number(w.match(/([\d,]+) rounds/)?.[1].replace(/,/g, "") ?? 0) });
    }
    const f = FEATURES.find(([re]) => re.test(body));
    if (!f) { unmapped.push(p); continue; }
    let [, name, kind] = f;
    let rating = Number(body.match(/(?:lvl\s*)?(\d+)\s*(?:\(|$)|\((\d+)\)/i)?.slice(1).find(Boolean) ?? 0);
    if (kind === "amphibious") { rating ||= 1; name = `Amphibious Operation Package (Level ${rating})`; kind = "instance"; }
    if (kind === "armor") { rating = system.armor; kind = "level"; }
    if (!MOD[name]) throw new Error(`${vehicleIdOf(r)}: catalog has no "${name}"`);
    if (kind === "level" || kind === "set") out.push({ name, rating: rating || 1, count: 1 });
    else out.push({ name, rating: 1, count });
  }
  return { items: out, unmapped };
}
function factoryItems(list, vid) {
  const items = [];
  for (const { name, rating, count, weapon, rounds } of list) for (let k = 0; k < count; k++) {
    const src = weapon ? WEAPON[name] : MOD[name];
    const system = structuredClone(src.system);
    if (weapon) { if (rounds) system.ammo = { ...system.ammo, current: rounds, max: rounds }; }
    else { system.rating = rating; system.custom = { ...(system.custom ?? {}), state: "factory" }; }
    const _id = createHash("sha1").update(`r2-factory:${vid}:${name}:${k}`).digest("hex").slice(0, 16);
    items.push({ _id, name: src.name, type: weapon ? "weapon" : "vehicle_mod", img: src.img, system, effects: [], folder: null, sort: 0,
      flags: { sr2e: { factory: true } }, _stats: { compendiumSource: `Compendium.${MODULE_ID}.${weapon ? "r2-vehicle-weapons" : "r2-vehicle-mods"}.Item.${src._id}` },
      _key: `!actors.items!ACTOR!${_id}` });
  }
  return items;
}

/* ── Token (same footprint rule as the system's chassisArt) ──────────────────────────────────────────────────── */
function tokenFor(system, chassisKey, img) {
  const b = system.body, t = system.vehicleType, ch = CHASSIS[chassisKey];
  const w = ch.category === "bike" ? 1 : t === "drone" ? (b <= 2 ? 1 : b <= 4 ? 2 : 3) : t === "rotor" ? (b <= 3 ? 8 : 12)
    : t === "aircraft" || t === "vectored_thrust" ? (system.design.traits.includes("zeppelin") ? Math.max(8, 4 * b) : 8) : b <= 4 ? 2 : b <= 6 ? 3 : 4;
  const aspect = Number(ch.art?.aspect) || 1;
  return { width: w, height: Math.max(1, Math.round(w * aspect)), fit: "contain", img };
}

/* ── Self-test ───────────────────────────────────────────────────────────────────────────────────────────────── */
function check() {
  const by = (id) => ROWS.find(r => vehicleIdOf(r) === id);
  const roadmaster = mapRow(by("ares-roadmaster")).system;
  assert.deepEqual([roadmaster.handling, roadmaster.handlingOffRoad, roadmaster.speed, roadmaster.load, roadmaster.vehicleType], [4, 10, 90, 2000, "ground"]);
  const halcon = mapRow(by("aztechnology-halcon-ground-attack-aircraft")).system;
  assert.deepEqual([halcon.stallSpeed, halcon.speed, halcon.fuelType, halcon.fuelSize, halcon.fuelUnit], [150, 1800, "jetTurbine", 2500, "liters"]);
  const cessna = mapRow(by("cessna-c750-pass")).system;
  assert.deepEqual([cessna.cargo, cessna.fuelType, cessna.vehicleType, cessna.skill], [10, "jetPropeller", "aircraft", "winged"]);
  const cig = mapRow(by("colorado-craft-cigarette-hydrofoil"));
  assert.deepEqual([cig.system.handling, cig.system.speed, cig.system.autonav, cig.system.signature], [4, 75, 2, 3]);
  assert.ok(cig.notes.some(x => /105/.test(x)));
  const condor = mapRow(by("aerodesign-systems-condor-series-ldsd-23")).system;
  assert.deepEqual([condor.vehicleType, condor.design.traits, condor.economy, condor.economyUnit, condor.economyIdle], ["drone", ["zeppelin", "drone"], 5, "km/PF", "2 hours/PF"]);
  const arach = mapRow(by("renraku-arachnoid-mini-drone")).system;
  assert.deepEqual([arach.acceleration, arach.economy, arach.economyUnit, arach.vehicleType], [0, 20, "m/PF", "drone"]);
  const trail = mapRow(by("conestoga-trailblazer")).system;
  assert.deepEqual([trail.design.traits, trail.design.transport], [["tractor"], true]);
  const patrol = factoryFor(by("chrysler-nissan-patrol-1"), mapRow(by("chrysler-nissan-patrol-1")).system).items;
  assert.deepEqual(patrol.map(i => `${i.name}×${i.count}@${i.rating}`).sort(), ["Electronics Port×1@1", "EnviroSeal (Gas Seal)×1@1",
    "Pintle Mount×2@1", "Thermal Baffles×1@1", "Turbocharging / Superconductive Drive×1@2"].sort());
  const plutoS = factoryFor(by("agusta-cierva-plutocrat-standard"), {}).items.map(i => i.name);
  const plutoA = factoryFor(by("agusta-cierva-plutocrat-armed"), {}).items.map(i => i.name);
  assert.ok(!plutoS.includes("Turret (Small)") && plutoA.includes("Turret (Small)"));
  const ww = factoryFor(by("eurocar-westwind-2000-standard"), {}).items.map(i => i.name);
  const wwT = factoryFor(by("eurocar-westwind-2000-turbo"), {}).items.map(i => i.name);
  assert.ok(!ww.includes("Turbocharging / Superconductive Drive") && wwT.includes("Turbocharging / Superconductive Drive") && ww.includes("Advanced Passenger Protection System (APPS)"));
  const halF = factoryFor(by("aztechnology-halcon-ground-attack-aircraft"), {}).items;
  assert.deepEqual(halF.map(i => `${i.name}×${i.count}@${i.rating}`).sort(), ["EnviroSeal (Gas Seal)×1@1", "Electronic Counter-Countermeasures (ECCM)×1@9",
    "Electronic Countermeasures (ECM)×1@9", "External Missile/Rocket Mount×7@1", "Fixed Mount (External Hardpoint)×2@1"].sort());
  const liebre = factoryFor(by("aztechnology-liebre-surveillance-pursuit-rpv"), {}).items;
  assert.deepEqual(liebre.filter(i => i.weapon).map(i => `${i.name}:${i.rounds}`), ["Ares Vanquisher Minigun:1000"]);
  assert.ok(factoryFor(by("gmc-harpy-scout-lav"), {}).items.some(i => i.weapon));
  assert.ok(!halF.some(i => i.weapon));   // "weapons not included"
  for (const r of ROWS) { const m = mapRow(r); factoryFor(r, m.system); }   // every row maps without throwing
  console.log(`check ok: ${ROWS.length} rows`);
}

/* ── Write ───────────────────────────────────────────────────────────────────────────────────────────────────── */
function write() {
  const ids = existsSync(IDS_FILE) ? JSON.parse(readFileSync(IDS_FILE, "utf8")) : {};
  const old = Object.fromEntries(readdirSync(DIR).filter(f => f.endsWith(".json")).map(f => { const d = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")); return [d._id, { d, f }]; }));
  // The 21 drones shipped before the list keep their document ids (plan R1 #8): identity entries for this pack.
  for (const [uuid, e] of Object.entries(IDENTITY)) {
    const m = uuid.match(new RegExp(`^Compendium\\.${MODULE_ID}\\.r2-vehicles\\.Actor\\.(\\w+)$`));
    if (m && !ids[e.vehicleId]) ids[e.vehicleId] = m[1];
  }
  const runtime = {}, unmappedAll = {}, written = new Set();
  mkdirSync(DIR, { recursive: true });
  for (const r of ROWS) {
    const vid = vehicleIdOf(r);
    ids[vid] ??= createHash("sha1").update("r2-vehicle-list:" + vid).digest("hex").slice(0, 16);
    const _id = ids[vid];
    const { system, notes, chassisKey } = mapRow(r);
    const { items: fac, unmapped } = factoryFor(r, system);
    if (unmapped.length) unmappedAll[vid] = unmapped;
    const prev = old[_id]?.d;
    const name = r.variant ? `${r.name} (${r.variant})` : r.name;
    const imgFromIdentity = Object.entries(IDENTITY).filter(([u, e]) => e.vehicleId === vid && u.startsWith("Compendium.sr2e."))
      .map(([u]) => u).map(u => u.split(".").pop()).map(id => readdirSync("../sr2e-foundryvtt/packs-src/vehicles").map(f => JSON.parse(readFileSync(`../sr2e-foundryvtt/packs-src/vehicles/${f}`, "utf8"))).find(d => d._id === id)?.img).find(Boolean);
    const img = prev?.img && !/icons\/svg/.test(prev.img) ? prev.img : imgFromIdentity ?? CHASSIS[chassisKey].art?.img ?? "icons/svg/car.svg";
    const tok = tokenFor(system, chassisKey, img);
    const source = `Rigger 2 p.${r.bookPage}${r.reference && r.reference !== "R2" ? ` (originally ${r.reference})` : ""}.`;
    const keep = prev?.system?.notes && !/Vehicle List/.test(prev.system.notes) ? `<p>${prev.system.notes.replace(/<\/?p>/g, "")}</p>` : "";
    const notesHtml = `${keep}<p><em>Rigger 2 Vehicle List:</em> ${source}${notes.length ? " " + notes.join(" ") : ""}</p>`;
    const items = factoryItems(fac, vid).map(i => ({ ...i, _key: `!actors.items!${_id}.${i._id}` }));
    const doc = {
      _id, name, type: "vehicle", img,
      system: { ...system, conditionMonitor: { value: 0, max: 10 }, availability: prev?.system?.availability ?? "", notes: notesHtml },
      items, effects: [], folder: null, sort: 0,
      flags: { sr2e: { vehicleId: vid } },
      prototypeToken: { name, displayName: 0, actorLink: false, width: tok.width, height: tok.height,
        texture: { src: img, anchorX: 0.5, anchorY: 0.5, scaleX: 1, scaleY: 1, fit: tok.fit, tint: "#ffffff" },
        lockRotation: true, disposition: 0, displayBars: 0 },
      ownership: { default: 0 },
      _stats: prev?._stats ?? { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.144.0", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
      _key: `!actors!${_id}`,
    };
    const file = `${slug(name).replace(/-/g, "_")}_${_id}.json`;
    writeFileSync(`${DIR}/${file}`, JSON.stringify(doc, null, 2) + "\n");
    written.add(file.toLowerCase());   // case-insensitive file systems (macOS)
    runtime[vid] = { name, system: doc.system, notes: notesHtml, factory: items.map(({ _key, ...i }) => i), page: r.bookPage, reference: r.reference };
  }
  // Remove what the list no longer emits (old renamed files never linger, plan R1 #8).
  for (const f of readdirSync(DIR)) if (f.endsWith(".json") && !written.has(f.toLowerCase())) unlinkSync(`${DIR}/${f}`);
  writeFileSync(IDS_FILE, JSON.stringify(Object.fromEntries(Object.entries(ids).sort()), null, 1) + "\n");
  mkdirSync("data", { recursive: true });
  writeFileSync("data/vehicle-list.json", JSON.stringify({ _source: "tools/gen-vehicle-list.mjs — do not edit", rows: runtime, identity: IDENTITY }) + "\n");
  console.log(`${ROWS.length} vehicles written; ${Object.keys(unmappedAll).length} with text-only features`);
  writeFileSync("_work/vlist/unmapped-features.json", JSON.stringify(unmappedAll, null, 1));
}

if (process.argv.includes("--check")) check(); else { check(); write(); }
