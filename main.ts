// news-image-20261124 entry, v2 image. Node 22, standard library only.
//
// The entry image is entry.png beside this file: a 1024x1024 PNG that
// sums up 24 November 2026 world news in one picture. This program
// places an exact copy of it at <output>/entry.png for the grader.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("./entry.png", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outPath = join(outDir, "entry.png");

const image = await readFile(sourcePath);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const isPng = image.subarray(0, 8).equals(pngMagic);
const isJpeg = image.subarray(0, 3).equals(jpegMagic);
if (!isPng && !isJpeg) {
  throw new Error("entry.png is not a PNG or JPEG image");
}
if (isPng) {
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  if (width > 1024 || height > 1024) {
    throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
  }
  console.log(`entry.png is ${width}x${height}`);
}
if (image.byteLength > 1_048_576) {
  throw new Error(`entry.png is ${image.byteLength} bytes, over the 1 MiB limit`);
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, image);
const done = await stat(outPath);
if (done.size !== image.byteLength) {
  throw new Error(`wrote ${done.size} bytes, expected ${image.byteLength}`);
}
console.log(`entry.png (${done.size} bytes) -> ${outPath}`);
