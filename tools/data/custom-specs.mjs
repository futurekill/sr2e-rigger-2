// Customization Specifications (Rigger 2 p.120–146), transcribed in pass 1 (tools/transcribe/custom-specs-pass1.jsonl)
// and written as data for the system's customization rules (system docs/archive/plans/PLAN-vehicle-customization.md C2). User
// rulings 11–13: level-8 electronics costs read as millions; ECCM levels 1/3 as printed; rigger adaptation 2,800¥.
// Formula variables: R (levels added), R0 (the family's levels already on the vehicle), R1 (= R0 + R), B (Body),
// P (Pilot), V (the vehicle's original cost), N (its power plant's cost), EY (its engine customization's ¥ cost),
// H / HO (Handling on/off-road), A1 (Armor after), S0 (Speed before turbocharging). A "key@trait" overrides by class.
// rows: one per rating (index = rating − 1): { cost, availability, streetIndex, restricted, baseTime, baseUnit, cf, load }.
// Base times are hours unless baseUnit says "days" (as printed). Where the book prints no rounding for a TN that
// divides, it's rounded up like its neighbour (concealed armor, p.127).

const VBR = ["vehicleBR"];
const tiers = (pts, prices) => {   // price per level by tier: pts = tier upper bounds, e.g. [3, 6, 9]
  let lo = 0; const parts = [];
  prices.forEach((p, i) => { const hi = pts[i];
    parts.push(hi == null ? `${p} x (max(R1, ${lo}) - max(R0, ${lo}))` : `${p} x (min(max(R1, ${lo}), ${hi}) - min(max(R0, ${lo}), ${hi}))`);
    lo = hi; });
  return parts.join(" + ");
};
const simple = (cost, availability, si, baseTime, tn, equipment, { f = {}, row = {}, skills = VBR, ...extra } = {}) => ({
  ...extra, f: { partsCost: String(cost), baseTime: String(baseTime), tn: String(tn), ...f },
  rows: [{ availability, streetIndex: si, ...row }], skills, equipment });
const table = (rows, baseTime, tn, equipment, skills) => ({ f: { baseTime, tn }, rows, skills, equipment, set: true });
const elec = (costs, cfs, kgs, avails, sis) => costs.map((c, i) => ({ cost: c, cf: cfs[i], load: kgs[i], availability: avails[i],
  streetIndex: sis[i] === "—" ? null : sis[i], restricted: sis[i] === "—" ? "military" : "" }));

const ENGINE_TN = { tn: "R1 + 3", "tn@drone": "R1 + 4", "tn@hovercraft": "R1 + 4", "tn@fixedWing": "R1 + 5", "tn@rotor": "R1 + 5", "tn@vector": "R1 + 5" };
const engineCustom = (stat) => ({ key: `engine-custom-${stat}`, stack: "levels", page: "p.120-121",
  f: { partsCost: "N x (1.25 x R + 0.15 x R x (R0 + R1 - 1) / 2)", baseTime: "40 x R", ...ENGINE_TN },
  rows: [{ availability: "8/14 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility",
  ...(stat === "speed" ? { max: { basis: "stat:speed", value: "S0 x 1.5", round: "down" } } : {}) });

export const CUSTOM = {
  "Engine Customization (Speed)": engineCustom("speed"),
  "Engine Customization (Acceleration)": engineCustom("acceleration"),
  "Engine Customization (Load)": engineCustom("load"),
  "GridLink Power": simple(600, "3/96 hours", 1, 16, 4, "Vehicle facility", { f: { cf: "1", load: "0" }, page: "p.121" }),
  "Nitrous Oxide Injectors": { key: "nitrous", stack: "levels", page: "p.121", max: { value: "5" },
    f: { partsCost: tiers([3], [3500, 7000]), baseTime: "R1 + 47", tn: "4", cf: "2", load: "15" },
    rows: [{ availability: "4/48 hours", streetIndex: 1 }], skills: VBR, equipment: "Vehicle facility" },
  "SunCell Power": simple(500, "3/72 hours", 1, 8, 4, "Vehicle shop", { f: { cf: "1", load: "0" }, page: "p.121" }),
  "Turbocharging / Superconductive Drive": { key: "turbocharging", stack: "levels", page: "p.122",
    f: { partsCost: "V x 1.1 x R", baseTime: "8 x R", tn: "R1 + 2", "tn@drone": "R1 + 3", "tn@hovercraft": "R1 + 3", "tn@electricAircraft": "R1 + 4", cf: "0", load: "0" },
    max: { basis: "stat:speed", value: "S0 x 1.5", round: "down", minOneLevel: true },
    rows: [{ availability: "6/12 days", streetIndex: 1.5 }], skills: VBR, equipment: "Vehicle facility" },
  "Adjusted Controls (Dwarf)": simple(2500, "3/72 hours", 1, 40, 4, "Vehicle facility", { page: "p.122" }),
  "Adjusted Controls (Troll)": simple(3500, "3/72 hours", 1, 40, 4, "Vehicle facility", { page: "p.122" }),
  "Adjusted Controls (Other)": simple(3000, "3/72 hours", 1, 40, 4, "Vehicle facility", { page: "p.122" }),
  "Autonavigation System": { ...table([
      { cost: 500, availability: "2/96 hours", streetIndex: 1, baseTime: 16 }, { cost: 1000, availability: "3/6 days", streetIndex: 1, baseTime: 32 },
      { cost: 5000, availability: "4/8 days", streetIndex: 1.5, baseTime: 4, baseUnit: "days" }, { cost: 15000, availability: "6/14 days", streetIndex: 2, baseTime: 48 }],
    null, "8 - H", "Vehicle facility", VBR), page: "p.123", effects: { autonavSet: "R" } },
  "Contingency Maneuver Controls (CMC)": { key: "cmc", stack: "levels", page: "p.124", max: { value: "9" },
    f: { partsCost: tiers([3, 6, null], [2500, 5000, 10000]), baseTime: "80", tn: "10 - H", cf: "2", load: "30" },
    rows: [{ availability: "6/14 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Datajack Port": { key: "datajack-port", page: "p.124",
    f: { partsCost: "2500", "partsCost@bike": "5000", baseTime: "56", "baseTime@bike": "112", tn: "4", "tn@bike": "8", cf: "1", load: "15" },
    rows: [{ availability: "3/72 hours", streetIndex: 1.5 }], skills: VBR, equipment: "Vehicle facility" },
  "Drive-by-Wire System": { key: "drive-by-wire", stack: "levels", page: "p.124", max: { value: "3" },
    f: { partsCost: "V x 1.25 x R", baseTime: "B x 160", tn: "10 - H", cf: "0", load: "0" },
    rows: [{ availability: "8/16 days", streetIndex: 2.5 }], skills: ["vehicleBR", "computer", "electronics"], combine: "sum", equipment: "Vehicle facility" },
  "Improved Control Surfaces (Watercraft)": { key: "improved-control-surfaces", stack: "levels", page: "p.125", max: { value: "2" },
    f: { partsCost: "V x 1.15 x R", baseTime: "R x 40", tn: "4", cf: "0", load: "0" },
    rows: [{ availability: "6/12 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Improved Suspension (Ground Vehicles)": { key: "improved-suspension", stack: "levels", page: "p.125", max: { value: "2" },
    f: { partsCost: "V x 1.10 x R", baseTime: "R x 40", tn: "4", cf: "0", load: "0" },
    rows: [{ availability: "6/12 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Off-Road Suspension": { key: "off-road-suspension", stack: "levels", page: "p.125", max: { value: "2" },
    f: { partsCost: "V x 1.35 x R", "partsCost@bike": "V x 1.2 x R", "partsCost@transport": "V x 1.5 x R", "partsCost@tractor": "V x 1.5 x R", baseTime: "R x 40", tn: "4", cf: "0", load: "0" },
    rows: [{ availability: "6/12 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Remote-Control Interface": { key: "remote-control-interface", page: "p.125-126",
    f: { partsCost: "2500 x B", baseTime: "16", tn: "4", cf: "0", load: "0" }, effects: { pilotSet: "1" },
    rows: [{ availability: "4/72 days", streetIndex: 2 }], skills: ["vehicleBR", "electronicsBR"], equipment: "Vehicle facility" },
  "Remote Pilot Advanced Programming": { ...table([
      { cost: 0, availability: "6/14 days", streetIndex: 2 }, { cost: 5000, availability: "6/14 days", streetIndex: 2 }, { cost: 25000, availability: "6/14 days", streetIndex: 2 },
      { cost: 500000, availability: "10/35 days", streetIndex: 4 }, { cost: 2500000, availability: "14/70 days", streetIndex: null, restricted: "military" }],
    "64", "8 - H", "Vehicle facility", ["computerBR"]), key: "remote-pilot", page: "p.126", effects: { pilotSet: "R" } },
  "Rigger Adaptation": simple(2800, "4/7 days", 2, 40, 4, "Vehicle facility", { key: "rigger-adaptation", f: { cf: "1", load: "10" }, page: "p.126" }),
  "Secondary Controls": simple(400, "3/72 hours", 1, 40, 4, "Vehicle facility", { f: { cf: "2", load: "0" }, page: "p.126-127" }),
  "Standard Vehicle Armor": { key: "standard-armor", stack: "levels", page: "p.127",
    f: { partsCost: "1250 x R", baseTime: "R x 8", tn: "ceil(A1 / 3)", cf: "0", load: "B x B x 5 x R" },
    rows: [{ availability: "6/12 days", streetIndex: 2.5 }], skills: VBR, equipment: "Vehicle facility" },
  "Concealed Vehicle Armor": { key: "concealed-armor", stack: "levels", page: "p.127",
    f: { partsCost: "2000 x R", baseTime: "R x 8", tn: "ceil(A1 / 3)", cf: "3 x R", load: "B x B x 5 x R" },
    rows: [{ availability: "8/21 days", streetIndex: 3.5 }], skills: VBR, equipment: "Vehicle facility" },
  "Ablative Armor": { key: "ablative-armor", page: "p.127", set: true, procedure: "fixed", fixedHours: 6,
    f: { load: "B x 100", cf: "0" },
    rows: [{ cost: 700, availability: "8/14 days", streetIndex: 2 }, { cost: 1600, availability: "12/14 days", streetIndex: 2 }, { cost: 2500, availability: "14/21 days", streetIndex: 2 }] },
  "Advanced Passenger Protection System (APPS)": simple("2500 x R", "3/6 days", 1, 40, 4, "Vehicle facility", { f: { cf: "1", load: "0" }, page: "p.128" }),
  "Crash Cage": simple(3500, "4/96 hours", 2, 16, 4, "Vehicle shop", { f: { cf: "2", load: "25" }, page: "p.128" }),
  "EnviroSeal (Gas Seal)": simple("250 x B", "8/14 days", 2.5, 12, 3, "Vehicle facility", { f: { cf: "1", load: "0" }, page: "p.128" }),
  "EnviroSeal (Water Seal)": simple("750 x B", "8/14 days", 2.5, 12, 3, "Vehicle facility", { f: { cf: "1", load: "0" }, page: "p.128" }),
  "EnviroSeal (Engine Seal)": simple("1000 x B", "8/14 days", 2.5, 12, 3, "Vehicle facility", { f: { cf: "1", load: "0" }, page: "p.128" }),
  "EnviroSeal (Cabin Overpressurization)": simple("5000 x B", "8/14 days", 2.5, 12, 3, "Vehicle facility", { f: { cf: "2", load: "15" }, page: "p.128" }),
  "Life Support System": simple("500 + 100 x R", "8/14 days", 2.5, 8, 3, "Vehicle shop", { f: { cf: "R / 10", load: "R / 10 x 25" }, page: "p.128-129" }),
  "Roll Bars": simple(2000, "3/72 hours", 1, 24, 3, "Vehicle shop", { key: "roll-bars", f: { cf: "0", load: "0" }, page: "p.129" }),
  "Smart Armor System (SAS)": { key: "sas", page: "p.129-130", f: { partsCost: "20000", baseTime: "B x 40", tn: "4", cf: "3", load: "B x 50" },
    rows: [{ availability: "10/28 days", streetIndex: null, restricted: "military" }], skills: ["demolitionsBR", "electronics", "computer"], equipment: "Vehicle facility" },
  "Thermal Baffles": { key: "thermal-baffles", stack: "levels", page: "p.130", max: { value: "2" },
    f: { partsCost: "B x 5000 x R", "partsCost@bike": "B x 6000 x R", "partsCost@truck": "B x 7500 x R", "partsCost@fixedWing": "B x 7500 x R",
      "partsCost@tractor": "B x 10000 x R", "partsCost@rotor": "B x 10000 x R", "partsCost@hovercraft": "B x 3750 x R", "partsCost@boat": "B x 2500 x R", "partsCost@zeppelin": "B x 2500 x R",
      baseTime: "R x 8", tn: "4", cf: "3 x R", load: "B x 50 x R" },
    rows: [{ availability: "6/14 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Active Thermal Masking": { key: "active-thermal-masking", stack: "levels", page: "p.130", max: { value: "min(2, L)" },
    f: { partsCost: "EY x (2 x R + 0.125 x R x (R0 + R1 - 1))", baseTime: "R x 8", tn: "4", cf: "3", load: "100" },
    rows: [{ availability: "8/21 days", streetIndex: 2 }], skills: VBR, equipment: "Vehicle facility" },
  "Radar-Absorbent Materials (RAM)": { key: "ram", stack: "levels", page: "p.130-131", max: { value: "3" },
    f: { partsCost: "(R1^3 - R0^3) x 25000", baseTime: "12", tn: "4", cf: "0", load: "0" },
    rows: [{ availability: "18/30 days", streetIndex: null, restricted: "military" }], skills: VBR, equipment: "Vehicle facility" },
  "Firearm Conversion Kit (Pistol)": simple(150, "4/36 hours", 2, 12, 4, "Weapons kit", { skills: ["weaponsBR"], f: { cf: "0", load: "0" }, page: "p.131" }),
  "Firearm Conversion Kit (SMG)": simple(350, "5/48 hours", 2, 12, 4, "Weapons kit", { skills: ["weaponsBR"], f: { cf: "0", load: "0.25" }, page: "p.131" }),
  "Firearm Conversion Kit (Rifle/Shotgun/LMG)": simple(750, "6/72 hours", 2.5, 12, 4, "Weapons kit", { skills: ["weaponsBR"], f: { cf: "0", load: "0.5" }, page: "p.131" }),
  "Firearm Conversion Kit (Heavy Weapon)": simple(1000, "16/14 days", 2.5, 12, 4, "Weapons kit", { skills: ["weaponsBR"], f: { cf: "0", load: "1" }, page: "p.131" }),
  // External mounts are seen and unprotected: Signature −1 (p.131); internal ones only while armed (in play).
  "Fixed Mount (External Hardpoint)": simple(2000, "6/7 days", 2, 24, 4, "Vehicle facility", { f: { cf: "2", load: "10" }, effects: { signature: "-1" }, page: "p.131-132" }),
  "Fixed Mount (External Firmpoint)": simple(750, "6/7 days", 2, 24, 4, "Vehicle facility", { f: { cf: "1", load: "10" }, effects: { signature: "-1" }, page: "p.131-132" }),
  "Fixed Mount (Internal Hardpoint)": simple(3000, "6/7 days", 2, 24, 4, "Vehicle facility", { f: { cf: "7", load: "10" }, page: "p.131-132" }),
  "Fixed Mount (Internal Firmpoint)": simple(1500, "6/7 days", 2, 24, 4, "Vehicle facility", { f: { cf: "5", load: "10" }, page: "p.131-132" }),
  "Gunnery Recoil Adjuster": { key: "recoil-adjuster", stack: "levels", page: "p.132", max: { value: "12" },
    f: { partsCost: "500 x R", baseTime: "24", tn: "4", cf: "1", load: "R + 24" },
    rows: [{ availability: "6/48 hours", streetIndex: 1.5 }], skills: VBR, equipment: "Vehicle kit" },
  "Pintle Mount": simple(50, "4/96 hours", 1.5, 12, 2, "Vehicle shop", { f: { cf: "0", load: "0" }, page: "p.133" }),
  "Ring Mount": simple(3000, "8/14 days", 2, 8, 3, "Vehicle shop", { f: { cf: "1", "cf@rotor": "16", load: "25" }, page: "p.134" }),
  "Smartlink Integration Kit (Level I)": simple(650, "4/48 hours", 1, 24, 4, "Vehicle kit", { f: { cf: "1", load: "0" }, page: "p.134" }),
  "Smartlink Integration Kit (Level II)": simple(900, "6/48 hours", 2, 24, 4, "Vehicle kit", { f: { cf: "1", load: "0" }, page: "p.134" }),
};
// Turrets (p.134–136): availability by the printed formula on the vehicle's cost (see the item notes).
const TURRET_AV = "([Vehicle Cost ÷ 25] ÷ 6) × (Vehicle Cost ÷ 25) × 14 days (p.135)";
const turret = (cost, si, cf, load, extra = {}) => simple(cost, TURRET_AV, si === "mil" ? null : si, 72, 4, "Vehicle facility",
  { row: si === "mil" ? { restricted: "military" } : {}, f: { cf: String(cf), load: String(load) }, page: "p.134-136", ...extra });
Object.assign(CUSTOM, {
  "Turret (Mini)": turret(5000, 2, 7, 25), "Turret (Small)": turret(7500, 3, 8, 100), "Turret (Medium)": turret(15000, "mil", 24, 1000),
  "Anti-Aircraft Turret (Mini)": turret(7500, 2, 8, 25), "Anti-Aircraft Turret (Small)": turret(11250, 3, 9, 100), "Anti-Aircraft Turret (Medium)": turret(22500, "mil", 25, 1000),
  "Pop-Up Turret (Mini)": turret(5000, 2, 14, 25), "Pop-Up Turret (Small)": turret(7500, 3, 16, 100), "Pop-Up Turret (Medium)": turret(15000, "mil", 48, 1000),
  "Remote Turret (Micro)": turret(2500, 2, 1, 10), "Remote Turret (Mini)": turret(6000, 2, 4, 25), "Remote Turret (Small)": turret(9000, 3, 5, 100), "Remote Turret (Medium)": turret(17500, "mil", 8, 1000),
  "Vehicle Gyroscopic Stabilizer": { key: "gyro", stack: "levels", page: "p.136", max: { value: "2 x B" },
    f: { partsCost: "1000 x R", baseTime: "24", tn: "4", cf: "1", load: "R + 24" },
    rows: [{ availability: "8/72 hours", streetIndex: 1.5 }], skills: VBR, equipment: "Vehicle kit" },
  "BattleTac FDDM Receiver Module": simple("P x 35000", "10/21 days", 3, 64, 4, "Microtronics shop", { skills: ["computerBR"], f: { cf: "0", load: "0" }, page: "p.136" }),
  "BattleTac IVIS Receiver Module": simple("P x 25000", "8/14 days", 3, 64, 4, "Microtronics shop", { skills: ["computerBR"], f: { cf: "0", load: "0" }, page: "p.136-137" }),
  "Electronic Countermeasures (ECM)": { ...table(elec(
      [25000, 75000, 125000, 250000, 375000, 750000, 1500000, 7500000, 15000000, 30000000], [1, 2, 3, 6, 3, 8, 9, 12, 16, 20], [12, 25, 35, 50, 35, 75, 110, 150, 200, 250],
      ["5/7 days", "6/10 days", "7/14 days", "8/21 days", "10/30 days", "12/45 days", "14/60 days", "16/3 months", "18/6 months", "20/1 year"], [2.5, 3, 3.5, 4, "—", "—", "—", "—", "—", "—"]),
    "16 x R", "4", "Vehicle facility", ["electronicsBR"]), key: "ecm", page: "p.137" },
  "Electronic Counter-Countermeasures (ECCM)": { ...table(elec(
      [110000, 30000, 350000, 100000, 150000, 250000, 750000, 2500000, 6000000, 12000000], [1, 2, 3, 6, 3, 8, 9, 12, 16, 20], [12, 25, 35, 50, 35, 75, 110, 150, 200, 250],
      ["4/7 days", "4/10 days", "5/14 days", "6/21 days", "8/30 days", "10/45 days", "12/60 days", "14/3 months", "16/6 months", "18/1 year"], [2, 2.5, 3, 3.5, "—", "—", "—", "—", "—", "—"]),
    "16 x R", "4", "Vehicle facility", ["electronicsBR"]), key: "eccm", page: "p.137-138" },
  "Electronic Deception (ED)": { ...table(elec(
      [50000, 150000, 400000, 1000000, 4000000, 8000000], [3, 5, 7, 5, 7, 9], [35, 45, 60, 45, 60, 110],
      ["8/30 days", "8/45 days", "8/60 days", "10/3 months", "12/6 months", "16/1 year"], [3, 3.5, 4, 4.5, 5, "—"]),
    "16 x R", "4", "Vehicle facility", ["electronicsBR"]), key: "ed", page: "p.138" },
  "Electronic Counter-Deception (ECD)": { ...table(elec(
      [25000, 80000, 200000, 750000, 2000000, 5000000], [3, 5, 7, 4, 6, 8], [35, 45, 60, 45, 60, 110],
      ["8/30 days", "8/45 days", "8/60 days", "10/3 months", "12/6 months", "16/1 year"], [3, 3.5, 4, 4.5, 5, "—"]),
    "16 x R", "4", "Vehicle facility", ["electronicsBR"]), key: "ecd", page: "p.138-139" },
  "Electronics Port": simple(1000, "3/6 days", 1, 8, 3, "Vehicle shop", { skills: ["electronicsBR"], f: { cf: "R", load: "0" }, page: "p.138-139" }),
  "Power Amplifier": { key: "power-amplifier", stack: "levels", page: "p.139", max: { value: "10" },
    f: { partsCost: "250 x R", baseTime: "8", tn: "3", cf: "ceil(0.5 x R)", load: "R" },
    rows: Array.from({ length: 10 }, (_, i) => ({ availability: `${i + 1}/${(i + 1) * 12} hours`, streetIndex: 1.5 })), skills: ["electronicsBR"], equipment: "Vehicle shop" },
  "Sensors (Vehicle Sensor System)": { ...table(elec(
      [5000, 15000, 25000, 50000, 75000, 125000, 375000, 1250000, 3000000, 6000000], [1, 2, 3, 6, 3, 8, 9, 12, 16, 20], [12, 25, 35, 50, 35, 75, 110, 150, 200, 250],
      ["4/7 days", "4/10 days", "5/14 days", "6/21 days", "8/30 days", "10/45 days", "12/60 days", "14/3 months", "16/6 months", "18/1 year"], [2, 2.5, 3, 3.5, "—", "—", "—", "—", "—", "—"]),
    "16 x R", "4", "Vehicle facility", ["electronicsBR"]), key: "sensors", page: "p.139-140", effects: { sensorSet: "R" } },
  "Amphibious Operation Package (Level 1)": simple(2500, "5/10 days", 1.25, 32, 3, "Vehicle facility", { f: { cf: "0", load: "0" }, page: "p.140" }),
  "Amphibious Operation Package (Level 2)": simple(7500, "6/12 days", 1.5, 40, 4, "Vehicle facility", { f: { cf: "2", load: "0" }, page: "p.140" }),
  "Amphibious Operation Package (Level 3)": simple(15000, "3/6 days", 1, 80, 5, "Vehicle facility", { f: { cf: "4", load: "0" }, page: "p.140-141" }),
  "Anti-Theft System": { key: "anti-theft", stack: "levels", page: "p.141", max: { value: "10" },
    f: { partsCost: tiers([3, 6, 9, null], [100, 400, 1000, 5000]), baseTime: "40", tn: "4", cf: "0", load: "0" },
    rows: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4].map(t => [null, { availability: "3/6 days", streetIndex: 1 }, { availability: "4/7 days", streetIndex: 1.25 },
      { availability: "5/10 days", streetIndex: 1.5 }, { availability: "6/14 days", streetIndex: 2 }][t]), skills: VBR, equipment: "Vehicle facility" },
  "Anti-Theft Shock System": simple(2000, "3/6 days", 1, 40, 4, "Vehicle facility", { f: { cf: "0", load: "0" }, page: "p.141" }),
  "Bench Seat": simple(750, "3/48 hours", 1, 4, 3, "Vehicle shop", { f: { cf: "6", load: "100" }, page: "p.142-143" }),
  "Folding Bench Seat": simple(750, "3/48 hours", 1, 4, 3, "Vehicle shop", { f: { cf: "6", load: "100" }, page: "p.142-143" }),
  "Reinforced Bench Seat": simple(1500, "3/48 hours", 1, 4, 3, "Vehicle shop", { f: { load: "300" }, page: "p.142-143" }),
  "Bucket Seat": simple(700, "3/48 hours", 1, 4, 3, "Vehicle shop", { f: { cf: "6", load: "100" }, page: "p.142-143" }),
  "Reinforced Bucket Seat": simple(1500, "3/48 hours", 1, 4, 3, "Vehicle shop", { f: { cf: "8", load: "250" }, page: "p.142-143" }),
  "Ejection Bucket Seat": simple(3000, "5/10 days", 2, 16, 4, "Vehicle facility", { f: { cf: "7", load: "110" }, page: "p.142" }),
  "Reinforced Ejection Bucket Seat": simple(6000, "5/10 days", 2, 16, 4, "Vehicle facility", { f: { cf: "7", load: "260" }, page: "p.142" }),
  "Convertible Top (Rag-Top)": simple("V x 0.1 + 2500", "4/72 hours", 1, 24, 3, "Vehicle shop", { f: { cf: "0", load: "0" }, page: "p.143" }),
  // Crane / winch Load Rating maxima: the Capacity Tables by Body (p.144, p.146); Body 10+ = Body × Body × 750 kg.
  "Crane": simple("R x 100", "6/14 days", 2, "B x 16", 4, "Vehicle facility", { f: { cf: "35", load: "B x 80" }, page: "p.143-144",
    max: { byBody: [0, 25, 200, 750, 2000, 5000, 20000, 30000, 45000, 60000], beyond: "B x B x 750" } }),
  "Drone Rack": simple("V x 0.1 + 2500", "4/96 hours", 2, "B x 8", 4, "Vehicle facility", { f: { cf: "R + 2", load: "45" }, page: "p.144" }),
  "External Cargo Mount": simple("250 x R", "3/24 hours", 1, 8, 2, "Vehicle shop", { f: { cf: "0", load: "0" }, page: "p.144" }),
  "Floatation Package (Aircraft)": simple("V x 0.1 + 2500", "4/7 days", 2, 32, 3, "Vehicle facility", { f: { cf: "0", load: "100" }, page: "p.144-145" }),
  "Hovercraft Water Seals": simple("500 x B", "4/96 hours", 1, 32, 3, "Vehicle facility", { f: { cf: "0", load: "0" }, page: "p.145" }),
  "Mechanical Arms": simple("B x 25000 + " + tiers([3, null], [75000, 90000]), "4/4 days", 1, 40, 6, "Vehicle facility",
    { skills: ["cyberBR"], f: { cf: "4", load: "(B x B + R) x 25" }, page: "p.145" }),
  "Motorcycle Sidecar (Small)": { f: { partsCost: "1000" }, procedure: "fixed", fixedHours: 0.25, rows: [{}], page: "p.145" },
  "Motorcycle Sidecar (Medium)": { f: { partsCost: "2000" }, procedure: "fixed", fixedHours: 0.25, rows: [{}], page: "p.145" },
  "Motorcycle Sidecar (Large)": { f: { partsCost: "3500" }, procedure: "fixed", fixedHours: 0.25, rows: [{}], page: "p.145" },
  "Spotlight": simple(600, "4/96 hours", 1.5, 1, 3, "Vehicle shop", { f: { cf: "0", load: "0", baseUnit: "days" }, page: "p.145-146" }),
  "Winch": simple("R x 75", "6/14 days", 2, "B x 16", 4, "Vehicle facility", { f: { cf: "1", load: "B x 2.5" }, page: "p.146",
    max: { byBody: [5, 25, 200, 750, 2000, 5000, 20000, 30000, 45000, 60000], beyond: "B x B x 750" } }),
  "Structural Agility": { customizable: false, page: "p.118" },
});
