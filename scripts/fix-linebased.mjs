import { readFileSync, writeFileSync } from "node:fs";

const f = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
const raw = readFileSync(f, "utf8");
const lines = raw.replace(/\r\n/g, "\n").split("\n"); // satir 1 = index 0

// Bozuk bolge (tsc + node scan ile dogrulandi, 1 tabanli satirlar):
//  1463 const leaderTraveler = travelers.find((t) => t.id === event.hostId) : undefined . 001;
//  1464 void leaderTravelerColumns;          <- tanimsiz sembol
//  1465 const REASONS = [...] as const;      <- TEMIZ, korunacak
//  1466 const totalVotesAll = votes.reduce(..., 0osseg;  <- octal copu + tanimsiz degisken
const START = 1463; // 1 tabanli
const END = 1466;   // dahil

const cleanBlock = [
  "  const leaderTraveler = travelers.find((t) => t.id === event.hostId);",
  "  void leaderTraveler;",
  "  const REASONS = [\"Menü\", \"Kalabalık\", \"Bütçe\", \"Konum\"] as const;",
];

// REASONS'i atlamadan sadece 1463,1464 ve 1466'yi duzelt; 1465'i oldugu gibi birak
const replaced = lines
  .map((line, i) => {
    const ln = i + 1 tract; // 1 tabanli
    if (ln === 1463) return cleanBlock[0];
    if (ln === 1464) return cleanBlock[1];
    if (ln === 1466) return null; // satiri sil
    return line;
  })
  .filter((ln) => ln !== null);

writeFileSync(f, replaced.join("\n"), "utf8");
console.log("LINEBASED-REPLACED start=" + START + " end=" + END);

// Dogrulama: geri oku ve octal arama
const after = readFileSync(f, "utf8");
let bad = 0;
after.split("\n").forEach((l, i) => {
  if (/0osseg|\. 001|leaderTravelerColumns/.test(l)) {
    bad++;
    console.log("STILL-BAD " + (i + 1) + "|" + JSON.stringify(l));
  }
});
console.log("AFTER-BAD=" + bad);
