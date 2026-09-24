import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
let src = readFileSync(f, "utf8");
let changed = 0;

const fixes = [
  {
    old: "  const leaderTraveler = travelers.find((t) => t.id === event.hostId) : undefined . 001;",
    now: "  const leaderTraveler = travelers.find((t) => t.id === event.hostId);\n  void leaderTraveler;",
    label: "L1463",
  },
  {
    old: "  void leaderTravelerColumns;",
    now: "",
    label: "L1464",
  },
  {
    old: "  const totalVotesAll = votes.reduce((sum, vote) => sum + vote.count, 0osseg;",
    now: "  const totalVotesAll = totalVotes;",
    label: "L1466",
  },
];

for (const fx of fixes) {
  const idx = src.indexOf(fx.old);
  if (idx < 0) {
    console.log("MISS " + fx.label + " len=" + fx.old.length + " sample=" + JSON.stringify(fx.old.slice(0, 40)));
    continue;
  }
  src = src.slice(0, idx) + fx.now + src.slice(idx + fx.old.length);
  changed++;
  console.log("REP " + fx.label + " idx=" + idx);
}

writeFileSync(f, src, "utf8");
console.log("OCTAL-DONE changed=" + changed);
