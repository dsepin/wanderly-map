import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
const text = readFileSync(f, "utf8");
const lines = text.split("\n");
let done = 0;

for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];

  // 1) leaderTraveler satiri: octal copu olan sonu temizle
  if (/const leaderTraveler[^\n]*event\.hostId/.test(ln)) {
    lines[i] = "  const leaderTraveler = travelers.find((t) => t.id === event.hostId);";
    done++;
    console.log("L1-OK idx=" + (i + 1));
  }
  // 2) hayalet satir: void leaderTravelerColumns; -> void leaderTraveler;
  else if (/^  void leaderTraveler\w+;/.test(ln)) {
    lines[i] = "  void leaderTraveler;";
    done++;
    console.log("L2-OK idx=" + (i + 1));
  }
  // 3) totalVotesAll cop satiri: reduce baslatani octal iceriyor -> temizle
  else if (/^  const totalVotesAll[^\n]*votes\.reduce/.test(ln)) {
    lines[i] = "  void totalVotesAll;";
    done++;
    console.log("L3-OK idx=" + (i + 1));
  }
}

if (done === 3) {
  writeFileSync(f, lines.join("\n"), "utf8");
  console.log("FIX-THREE-OK done=" + done);
} else {
  console.error("FIX-THREE-INCOMPLETE done=" + done);
  process.exit(1);
}
