#!/usr/bin/env node
/**
 * Default artwork for the Workshop's chassis (system Vehicle Workshop): each chassis gets the closest existing vehicle
 * portrait (system or this module), or a generic exemplar made for it (assets/vehicle_portraits/chassis/<key>.webp).
 * Writes `art: { img, aspect }` (aspect = trimmed height ÷ width, for the token's length) into
 * tools/data/design-chassis.json; then `npm run sync-design-data`.
 *
 *   node tools/chassis-art.mjs           # report missing files
 *   node tools/chassis-art.mjs --write   # write the art into the chassis table
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const SYS = "systems/sr2e/assets/vehicle_portraits/", MOD = "modules/sr2e-rigger-2/assets/vehicle_portraits/";
const GEN = (key) => `${MOD}chassis/${key}.webp`;
// Chosen by eye from the contact sheets (_work/chassis-art): the closest picture of that kind of vehicle.
export const CHASSIS_ART = {
  scooter: SYS + "dodge-scoot.webp", racingCycle: SYS + "yamaha-rapier.webp", offRoadBike: GEN("offRoadBike"),
  chopper: SYS + "harley-scorpion.webp", atv: GEN("atv"),
  subcompact: SYS + "chrysler-nissan-jackrabbit.webp", sedan: SYS + "ford-americar.webp", sportsCar: SYS + "eurocar-westwind-2000.webp",
  limousine: SYS + "mitsubishi-nightsky.webp", pickup: SYS + "ford-bison.webp", van: SYS + "gmc-bulldog.webp", rv: GEN("rv"),
  sandBuggy: GEN("sandBuggy"), mediumTransport: GEN("mediumTransport"), heavyTransport: GEN("heavyTransport"), tractor: GEN("tractor"),
  apcTracked: GEN("apcTracked"), apcWheeled: SYS + "ares-citymaster.webp",
  crawlerMicro: MOD + "citroen-brouillard-smoke-generator.webp", crawlerSmall: MOD + "aztechnology-gcr-23c-crawler.webp",
  crawlerLarge: MOD + "mesametric-kodiak-roadway-clearance-system.webp", rpv: SYS + "patrol-vehicle-drone.webp",
  hovercraftSmall: SYS + "chrysler-nissan-g12a.webp", hovercraftMedium: SYS + "gmc-beachcraft-patroller.webp", hovercraftLarge: SYS + "gmc-beachcraft-patroller.webp",
  skimmerSmall: MOD + "sikorsky-bell-microskimmer-ii.webp", skimmerLarge: MOD + "sikorsky-bell-microskimmer-ii.webp",
  skiff: SYS + "samuvani-criscraft-otter.webp", waterScooter: GEN("waterScooter"), speedboat: SYS + "sendanko-marlin.webp",
  sportCruiser: SYS + "gmc-riverine.webp", yacht: GEN("yacht"), minisub: GEN("minisub"),
  autogyro: GEN("autogyro"), utilityHelicopter: SYS + "hughes-airstar.webp", cargoHelicopter: SYS + "ares-dragon.webp",
  tiltWing: SYS + "federated-boeing-commuter.webp", attackHelicopter: SYS + "hughes-wk-2-stallion.webp",
  rotaryUavS: MOD + "mct-nissan-roto-drone.webp", rotaryUavM: SYS + "northrup-prc-42b-wasp.webp", rotaryUavL: SYS + "frc-44b-yellowjacket.webp",
  tiltWingUavM: MOD + "fmc-stonebrooke-tads-firebird.webp", tiltWingUavL: MOD + "iws-dlk-mk-6-utility-machine.webp",
  ultralight: GEN("ultralight"), singleEngine: GEN("singleEngine"), twinEngine: SYS + "cessna-c750.webp",
  airliner: MOD + "pratt-whitney-sundowner.webp", jetFighter: SYS + "efa-eurofighter.webp",
  fixedUavS: MOD + "aerodesign-condor-ldsd-23.webp", fixedUavM: MOD + "aerodesign-condor-ii-ldsd-41.webp", fixedUavL: MOD + "aeroquip-redball-express.webp",
  thunderbird: SYS + "gmc-banshee.webp", jumpJet: SYS + "federated-boeing-eagle.webp",
  vectorUavS: SYS + "spotter-drone.webp", vectorUavL: SYS + "surveillance-drone.webp",
  zeppelin: GEN("zeppelin"), miniBlimp: GEN("miniBlimp"), anthroform: GEN("anthroform"),
  walkerMicro: MOD + "renraku-arachnoid-mini-drone.webp", walkerSmall: MOD + "shiawase-kanmushi-mechanical-crawler.webp", walkerLarge: GEN("walkerLarge")
};
const local = (img) => img.startsWith(SYS) ? `../sr2e-foundryvtt/assets/vehicle_portraits/${img.slice(SYS.length)}` : img.replace(/^modules\/sr2e-rigger-2\//, "");
const aspect = (file) => {
  const [w, h] = execFileSync("magick", [file, "-trim", "-format", "%w %h", "info:"], { encoding: "utf8" }).trim().split(/\s+/).map(Number);
  return Math.round((h / w) * 1000) / 1000;
};

const path = "tools/data/design-chassis.json";
const table = JSON.parse(readFileSync(path, "utf8"));
const missing = [];
for (const c of table.chassis) {
  const img = CHASSIS_ART[c.key];
  if (!img) { missing.push(`${c.key}: no entry`); continue; }
  if (!existsSync(local(img))) { missing.push(`${c.key}: ${local(img)}`); continue; }
  if (process.argv.includes("--write")) c.art = { img, aspect: aspect(local(img)) };
}
const stray = Object.keys(CHASSIS_ART).filter(k => !table.chassis.some(c => c.key === k));
if (stray.length) missing.push(`not chassis keys: ${stray.join(", ")}`);
if (process.argv.includes("--write") && !missing.length) writeFileSync(path, JSON.stringify(table, null, 2) + "\n");
console.log(missing.length ? `missing:\n  ${missing.join("\n  ")}` : `${table.chassis.length} chassis have art${process.argv.includes("--write") ? " (written)" : ""}`);
