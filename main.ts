// news-image-20261124 entry, Node 22, standard library only.
//
// The entry image lives next to this file as entry.png (a JPEG payload
// under a .png name is fine: the gate sniffs the bytes, not the name).
// This program copies it into the grader's output directory, after
// checking it is a real PNG or JPEG and stays inside the 1 MiB limit.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const SOURCE = new URL("./entry.png", import.meta.url);

const bytes = readFileSync(SOURCE);
const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG");
}
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry image is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

copyFileSync(SOURCE, join(OUTPUT_DIR, "entry.png"));
const written = statSync(join(OUTPUT_DIR, "entry.png"));
if (written.size !== bytes.length) {
  throw new Error(`copy incomplete: wrote ${written.size} of ${bytes.length} bytes`);
}
console.log(`wrote ${written.size} bytes to ${join(OUTPUT_DIR, "entry.png")}`);
