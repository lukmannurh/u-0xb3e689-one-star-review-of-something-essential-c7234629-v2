// One-Star Review of Something Essential — v2
// Writes one deadpan one-star review to $MAKEFUN_OUTPUT_DIR/entry.txt.
// No network, no input files, no secrets: the text lives here.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a deadpan one-star review of sleep.
// Chosen against the judge brief: the sharpest true grievance (the 3 a.m.
// replay of every embarrassing thing ever said), deadpan held, the sting
// lands in the last few words, one tight joke, no filler.
const ENTRY =
  "Sleep promises eight hours of rest and delivers a 3 a.m. replay of everything embarrassing I have ever said.";

function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.length > 160) {
    throw new Error(`entry is ${text.length} characters, over the 160 limit`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Deadpan hygiene: no exclamation mark doing the work. The plain-ASCII
  // check below also rejects em-dashes and emoji.
  if (text.includes("!")) {
    throw new Error("entry must stay deadpan: no exclamation mark");
  }
  if (/[^\x20-\x7E]/.test(text)) {
    throw new Error("entry must be plain ASCII text");
  }
  // The gate counts characters; make sure the text round-trips as UTF-8.
  const roundTrip = Buffer.from(text, "utf8").toString("utf8");
  if (roundTrip !== text) {
    throw new Error("entry is not clean UTF-8 text");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read the file back: a partial or altered write must fail loudly
  // instead of shipping a wrong entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error("written file does not match the entry text");
  }
}

main();
