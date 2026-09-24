import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/contexts/globetrotter-context.tsx", import.meta.url);
let src = readFileSync(f, "utf8");

const anchor = "export type GlobeTrotterPollVote = {";
const insertBefore = "export type VoteReason =\n  | \"Menü\"\n  | \"Kalabalık\"\n  | \"Bütçe\"\n  | \"Konum\";\n\nexport type GlobeTrotterPollVote = {";

if (!src.includes("export type VoteReason =")) {
  const idx = src.indexOf(anchor);
  if (idx >= 0) {
    src = src.slice(0, idx) + insertBefore + src.slice(idx + anchor.length);
    writeFileSync(f, src, "utf8");
    console.log("VOTEREASON-TYPE-ADDED");
  } else {
    console.error("VOTEREASON-ANCHOR-MISS");
    process.exit(1);
  }
} else {
  console.log("VOTEREASON-EXISTS");
}
