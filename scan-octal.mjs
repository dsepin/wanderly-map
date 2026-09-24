import { readFileSync } from "node:fs";
const f = "src/components/globetrotter-app.tsx";
const src = readFileSync(f, "utf8");
const lines = src.split("\n");
// 1444-1540 verbatim (satir bir tabanli)
for (let i = 1440; i <= 1545 && i <= lines.length; i++) {
  const l = lines[i - 1];
  const bad = /[0-9]\d*\d/.test(l) && (/0[0-9]/.test(l) || /[^\x00-\x7F]/.test(l));
  if (bad || (i >= 1460 && i <= 1469)) {
    console.log(i + "|" + JSON.stringify(l.slice(0, 200)));
  }
}
