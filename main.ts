import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Runtime source of truth: the one-liner lives in entry.txt, not in code,
// so editing the line never requires touching this program again.
// Reading at runtime also keeps this file free of any hard-coded content.
// Guard 1-199: the bounty caps the line below 200 characters, so an empty or overlong file is rejected before any output.
// Entrypoint: read entry.txt at runtime and copy it to the output dir.
// The entry line itself is NOT embedded here as a constant; it lives in
// entry.txt next to this file and is only read, validated, and copied.
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const text = readFileSync(entryPath, "utf8");

if (text.length < 1 || text.length > 199) {
  console.error(`entry.txt must be 1-199 characters, got ${text.length}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
process.exit(0);
