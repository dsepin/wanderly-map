import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
const text = readFileSync(f, "utf8");
const lines = text.replace(/\r\n/g, "\n").split("\n"); // lines[i] 0-based => disk satir i+1

// tsc'nin raporladigi bozuk satirlar (1 tabanli): 1463, 1464, 1466
for (let n = 1457; n <= 1468; n++) {
  const content = lines[n - 1];
  console.log(String(n).padStart(4) + "|" + JSON.stringify(content));
}

const target = { 1463: "  const leaderTraveler = travelers.find((t) => t.id === event.hostId);", 1464: "  void leaderTraveler;", 1466: "  const totalVotesAll = totalVotes;\n  void totalVotesAll;" };

let touched = 0;
for (const n of [1463, 1464, 1466]) {
  if (n - 1 < 0 || n - 1 >= lines.length) {
    console.error("OUT-OF-RANGE " + n);
    process.exit(1);
  }
  lines[n - 1] = target[n];
  touched++;
}

writeFileSync(f, lines.join("\n"), "utf8");
console.log("SPLICE-DONE touched=" + touched);
