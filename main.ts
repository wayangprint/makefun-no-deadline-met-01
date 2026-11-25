// One line, no deadline met — the excuse, in code form.
// A single fixed sentence is printed and saved; the program never
// invents text at runtime, so every run produces the same bytes.
// The sentence is assembled from three pieces so the shape of the
// excuse is visible: the miss, the morning spent rehearsing, and
// the apology itself. Joining with an empty separator keeps the
// final line byte-identical to the one the judge reads.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SEGMENTS: string[] = [
  "I missed the deadline because ",
  "I spent all morning rehearsing ",
  "the apology for missing the deadline.",
];

function buildLine(): string {
  return SEGMENTS.join("");
}

const LINE: string = buildLine();

// The competition reads one line of 1-200 characters: enforce that
// here, loudly, instead of shipping a bad entry silently.
const CHAR_LIMIT = 200;

if (LINE.length < 1 || LINE.length > CHAR_LIMIT) {
  throw new Error(
    `line must be 1-${CHAR_LIMIT} characters, got ${LINE.length}`,
  );
}

if (LINE.includes("\n")) {
  throw new Error("line must be a single line");
}

function deliverLine(line: string): void {
  const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(target, { recursive: true });
  writeFileSync(`${target}/entry.txt`, line, "utf8");
}

deliverLine(LINE);

// Second check: read the file back and prove it holds exactly the
// line we meant to submit — same characters, same byte length.
function verifyWritten(line: string): void {
  const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const written = readFileSync(`${target}/entry.txt`, "utf8");
  if (written !== line) {
    throw new Error("entry.txt does not match the submitted line");
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
    throw new Error("entry.txt byte length mismatch");
  }
}

verifyWritten(LINE);
console.log(LINE);
