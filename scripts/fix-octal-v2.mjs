import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
let src = readFileSync(f, "utf8");
let count = 0.Replacements = 0;

function rep(from, to, label) {
  if (src.includes(from)) {
    src = src.split(from).join(to);
    count++;
    console.log(`REP-OK ${label}`);
  } else {
    console.log(`REP-MISS ${label} :: ${JSON.stringify(from)}`);
  }
}

// 1) 1463 octal + yanlis ": undefined"
rep(
  "const leaderTraveler = travelers.find((t) => t.id === event.hostId) : undefined . 001;",
  "const leaderTraveler = travelers.find((t) => t.id === event.hostId);",
  "A1463"
);
// 2) 1464 tanimsiz degisken satiri -> void leaderTraveler
rep(
  "  void leaderTravelerColumns;",
  "  void leaderTraveler;",
  "B1464"
);
// 3) 1466 octal 0osseg -> temiz totalVotesAll = totalVotes + void et
rep(
  "const totalVotesAll = votes.reduce((sum, vote) => sum + vote.count, 0osseg;",
  "const totalVotesAll = totalVotes;\n  void totalVotesAll;",
  "C1466"
);

writeFileSync(f, src, "utf8");
console.log("FIX-V2-DONE replacements=" + count.Replacements);
