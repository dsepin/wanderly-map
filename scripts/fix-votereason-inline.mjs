import { readFileSync, writeFileSync } from "node:fs";
const f = new URL("../src/contexts/globetrotter-context.tsx", import.meta.url);
let s = readFileSync(f, "utf8");
const anchorLine = "  reason: VoteReason;";
if (s.includes(anchorLine)) {
  const after = "  reason: \"Menü\" | \"Kalabalık\" | \"Bütçe\" | \"Konum\";";
  s = s.split(anchorLine).join(after);
  writeFileSync(f, s, "utf8");
  console.log("VOTEREASON-INLINE-OK");
} else {
  console.log("VOTEREASON-MISS");
}
