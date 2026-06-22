/**
 * Rigger 2 vehicle-design data registration.
 *
 * The SR2E system ships the vehicle Design tab + the point-buy math but NOT the
 * Rigger 2 Chassis / Power Plant tables (those are sourcebook content). This
 * module owns those tables (data/chassis.json, data/powerplants.json) and feeds
 * them to the system registry via CONFIG.SR2E.registerVehicleDesignData() so the
 * Design tab populates whenever this module is enabled.
 *
 * The raw JSON mirrors the book's table layout (grouped by chassis class / engine
 * type, with the camera-shadow `_note` flags and drone "5x8" formula cells). Here
 * we flatten it into the normalized, slug-keyed shape the Design tab expects.
 */

const MODULE_ID = "sr2e-rigger-2";

/** Human labels for the chassis groups (raw JSON keys → display). */
const CHASSIS_GROUP_LABELS = {
  bikes: "Bikes", cars: "Cars", hovercraft: "Hovercraft", boats: "Boats",
  rotorcraft: "Rotorcraft", fixedWing: "Fixed Wing",
  vectorThrust: "Vector Thrust", special: "Special"
};

/** Human labels for the power-plant engine types. */
const ENGINE_LABELS = {
  electric: "Electric", methane: "Methane", gasoline: "Gasoline",
  diesel: "Diesel", jetPropeller: "Jet Propeller", jetTurbine: "Jet Turbine",
  sail: "Sail"
};

export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function loadJson(file) {
  const path = `modules/${MODULE_ID}/data/${file}`;
  const fetcher = foundry?.utils?.fetchJsonWithTimeout;
  if (fetcher) return fetcher(path);
  const res = await fetch(path);
  return res.json();
}

/** chassis.json (grouped by class) → { slug: normalized } */
export function normalizeChassis(raw) {
  const out = {};
  for (const [group, entries] of Object.entries(raw)) {
    if (group.startsWith("_") || typeof entries !== "object") continue;
    const groupLabel = CHASSIS_GROUP_LABELS[group] ?? group;
    for (const [name, e] of Object.entries(entries)) {
      if (name.startsWith("_") || typeof e !== "object") continue;
      out[`chassis-${slug(group)}-${slug(name)}`] = {
        name,
        group: groupLabel,
        dp: e.designPoints,
        handling: e.handling,
        body: e.body,
        armor: e.armor,
        pilot: e.pilot,
        sensor: e.sensor,
        autonav: e.autonav,
        cargoStart: e.cfStart,
        cargoMax: e.cfMax,
        seating: e.seating
      };
    }
  }
  return out;
}

/** powerplants.json (grouped by engine) → { slug: normalized } */
export function normalizePowerPlants(raw) {
  const out = {};
  for (const [engine, entries] of Object.entries(raw)) {
    if (engine.startsWith("_") || typeof entries !== "object") continue;
    const engineLabel = ENGINE_LABELS[engine] ?? engine;
    for (const [name, e] of Object.entries(entries)) {
      if (name.startsWith("_") || typeof e !== "object") continue;
      out[`pp-${slug(engine)}-${slug(name)}`] = {
        name,
        engine: engineLabel,
        dp: e.designPoints,
        speedStart: e.speedStart,
        speedMax: e.speedMax,
        accelStart: e.accelStart,
        accelMax: e.accelMax,
        loadStart: e.loadStart,
        loadMax: e.loadMax,
        sig: e.sig
      };
    }
  }
  return out;
}

if (typeof Hooks !== "undefined") Hooks.once("setup", async () => {
  if (!CONFIG.SR2E?.registerVehicleDesignData) {
    console.warn(`${MODULE_ID} | SR2E system not present or too old; skipping vehicle-design registration.`);
    return;
  }
  try {
    const [chassisRaw, powerRaw] = await Promise.all([
      loadJson("chassis.json"),
      loadJson("powerplants.json")
    ]);
    const chassis = normalizeChassis(chassisRaw);
    const powerPlants = normalizePowerPlants(powerRaw);
    CONFIG.SR2E.registerVehicleDesignData({ chassis, powerPlants });
    console.log(`${MODULE_ID} | Registered vehicle design data: `
      + `${Object.keys(chassis).length} chassis, ${Object.keys(powerPlants).length} power plants.`);
  } catch (err) {
    console.error(`${MODULE_ID} | Failed to register vehicle design data:`, err);
  }
});
