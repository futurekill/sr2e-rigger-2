/**
 * Rigger 2 vehicle-design tables for the SR2E system's Vehicle Workshop.
 *
 * The system ships the Workshop and the design engine (module/rules/vehicle-design.mjs) but not the book's tables.
 * This module registers its re-transcribed Chassis, Power Plant, Fuel Tank and Mark-Up tables (data/design-*.json,
 * the shipped copies of tools/data; docs/DESIGN-DATA-CHECK.md) with CONFIG.SR2E.registerVehicleDesignTables.
 */

const MODULE_ID = "sr2e-rigger-2";

async function loadJson(file) {
  const path = `modules/${MODULE_ID}/data/${file}`;
  const fetcher = foundry?.utils?.fetchJsonWithTimeout;
  if (fetcher) return fetcher(path);
  const res = await fetch(path);
  return res.json();
}

if (typeof Hooks !== "undefined") Hooks.once("setup", async () => {
  if (!CONFIG.SR2E?.registerVehicleDesignTables) {
    console.warn(`${MODULE_ID} | SR2E system not present or too old (needs 0.142.1+); skipping vehicle-design registration.`);
    return;
  }
  try {
    const [c, p, rules] = await Promise.all([loadJson("design-chassis.json"), loadJson("design-powerplants.json"), loadJson("design-rules.json")]);
    CONFIG.SR2E.registerVehicleDesignTables({ chassis: c.chassis, powerPlants: p.powerPlants, fuel: rules.fuel, markUp: rules.markUp });
    console.log(`${MODULE_ID} | Registered design tables: ${c.chassis.length} chassis, ${p.powerPlants.length} power plants.`);
  } catch (err) {
    console.error(`${MODULE_ID} | Failed to register vehicle design tables:`, err);
  }
});
