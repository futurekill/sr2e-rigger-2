#!/usr/bin/env node
/**
 * Trim the empty margin off vehicle portraits and pick each token's texture fit.
 *
 *   npm run fit-vehicles          # report
 *   npm run fit-vehicles -- --fix # rewrite the .webp files and packs-src
 *
 * WHY. The portraits are square 1024x1024 canvases with the vehicle drawn
 * down the middle, so most of the image is empty air — the Mitsubishi
 * Nightsky uses 25% of its canvas, and the median across the set is 50%.
 * Foundry's `contain` scales the WHOLE canvas, margin included, to fit the token
 * box, so the vehicle rendered at roughly half the size of its own footprint.
 * Trimming makes the image the vehicle, so it fills the box it was given.
 *
 * FOOTPRINTS come from tools/gen-vehicles.mjs, which sizes each drone from its
 * Body and takes the length from this trimmed art. Run the generator AFTER this,
 * so it measures trimmed files: `node tools/fit-vehicle-art.mjs --fix` then
 * `node tools/gen-vehicles.mjs`. This tool only reports the fit it would pick;
 * the generator is what writes it.
 *
 * Requires ImageMagick (`magick`), same as the other art tooling.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const FIX = process.argv.includes("--fix");
const DIR = "packs-src/r2-vehicles";
const MARGIN = 12;            // px kept around the vehicle so it clears the token border
const FILL_TOLERANCE = 0.08;  // stretch only when the box is within 8% of the art

const trimBox = (file) => {
  const out = execFileSync("magick", [file, "-trim", "-format", "%w %h", "info:"], { encoding: "utf8" });
  const [w, h] = out.trim().split(/\s+/).map(Number);
  return { w, h };
};

const rows = [];
for (const file of readdirSync(DIR).filter(f => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const doc = JSON.parse(readFileSync(path, "utf8"));
  if (!doc.system || !doc.img) continue;

  const rel = doc.img.replace(/^modules\/[^/]+\//, "");
  if (!existsSync(rel)) { console.log(`  missing art: ${doc.name} -> ${rel}`); continue; }

  const before = statSync(rel).size;
  const box = trimBox(rel);
  const pt = doc.prototypeToken ?? {};
  const artAspect = box.w / box.h;
  const boxAspect = (pt.width ?? 1) / (pt.height ?? 1);
  const err = Math.abs(artAspect - boxAspect) / artAspect;
  const fit = err <= FILL_TOLERANCE ? "fill" : "contain";

  if (FIX) {
    // Skip anything already trimmed, so re-running does not shave 12px each time.
    const full = execFileSync("magick", [rel, "-format", "%w %h", "info:"], { encoding: "utf8" })
      .trim().split(/\s+/).map(Number);
    if (full[0] > box.w + 2 * MARGIN || full[1] > box.h + 2 * MARGIN) {
      execFileSync("magick", [rel, "-trim", "+repage",
        "-bordercolor", "none", "-border", String(MARGIN), "-quality", "95", rel]);
    }
    // packs-src is owned by gen-vehicles.mjs here; only the image is rewritten.
  }

  rows.push({ name: doc.name, box: `${pt.width}x${pt.height}`, content: `${box.w}x${box.h}`,
              used: Math.round(100 * (box.w * box.h) / (1024 * 1024)), fit,
              kb: Math.round(before / 1024) });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${FIX ? "FITTED" : "WOULD FIT"} ${rows.length} vehicle(s)\n`);
console.log(`${pad("vehicle", 32)}${pad("token", 8)}${pad("art content", 13)}${pad("canvas used", 13)}fit`);
for (const r of rows.sort((a, b) => a.used - b.used)) {
  console.log(`${pad(r.name, 32)}${pad(r.box, 8)}${pad(r.content, 13)}${pad(r.used + "%", 13)}${r.fit}`);
}
console.log(`\nfill: ${rows.filter(r => r.fit === "fill").length}  contain: ${rows.filter(r => r.fit === "contain").length}`);
if (!FIX) console.log("\nRe-run with --fix to write.");
