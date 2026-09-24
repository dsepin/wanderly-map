import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = resolve(__dirname, "../src/components/globetrotter-app.tsx");
let src = readFileSync(app, "utf8");

// ── 1) Crown importunu lucide listesine ekle (yoksa) ──
if (!/\bCrown\b/.test(src)) {
  if (src.includes("  BellRing,\n")) {
    src = src.replace("  BellRing,\n", "  BellRing,\n  Crown,\n");
  } else if (src.includes("  Bell,\n")) {
    src = src.replace("  Bell,\n", "  Bell,\n  Crown,\n");
  } else {
    src = src.replace("} from \"lucide-react\";", "  Crown,\n} from \"lucide-react\";");
  }
}

// ── 2) İlk PollPanel marker'ı + MapSkeleton marker'ı arasındaki HER ŞEYİ tek temiz PollPanel ile değiştir ──
const firstPoll = src.indexOf("function PollPanel({ eventId }: { eventId: string }) {");
// MapSkeleton'ın tüm olası açılış biçimleri (bazıları "{  return (" şeklinde bozulmuş olabilir)
const mapSkelCandidates = [
  "function MapSkeleton() {",
  "function MapSkeleton() {\n  return (",
];
let mapEnd = -1;
for (const cand of mapSkelCandidates) {
  mapEnd = src.indexOf(cand, firstPoll + 1);
  if (mapEnd > firstPoll) break;
}
if (firstPoll < 0 || mapEnd < 0 || mapEnd <= firstPoll) {
  console.error("ANCHOR-FAIL firstPoll=", firstPoll, "mapEnd=", mapEnd);
  process.exit(1);
}

const cleanPoll = `function PollPanel({ eventId }: { eventId: string }) {
  const {
    friendVotes,
    voteForEvent,
    leaderEventIds,
    allEvents,
    travelers,
    joinedEventIds,
  } = useGlobeTrotter();
  const votes = friendVotes[eventId] ?? [];
  const totalVotes = votes.reduce((sum, vote) => sum + vote.count, 0);
  const isLeader = leaderEventIds.includes(eventId);
  const event = allEvents.find((item) => item.id === eventId);
  if (!event) return null;
  const isJoined = joinedEventIds.includes(eventId porcıda);
  const isLeaderOf = isLeader;
  const leaderTraveler = travelers.find((item) => item.id === event.hostId);
  void leaderTraveler;
  const totalVotesForPct = totalVotes > 0 ? totalVotes : 1;
  const leaderText = isLeaderOf
    ? "Sen lider oldun — kararı sen veriyorsun"
    : isJoined
      ? "Grup kararı için oyunu ver"
      : "İlk istek yollayan lider seçilir";

  const REASONS = ["Menü", "Kalabalık", "Bütçe", "Konum"] as const;

  if (!isJoined && !isLeaderOf) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Grup Kararı</p>
          <p className="text-xs text-muted-foreground">{leaderText}</p>
        </div>
        {isLeaderOf ? (
          <span className="flex items-center gap-1.5 rounded-full bg-terracotta/15 px-2.5 py-1 text-xs font-bold text-terracotta">
            <Crown className="size-3.5" /> Lider
          </span>
        ) : null}
      </div>
      <div className="grid gap-2">
        {REASONS.map((reason) => {
          const vote = votes.find((item) => item.reason === reason);
          const pct = Math.round(((vote?.count ?? 0) / totalVotesForPct) * 100);
          return (
            <button
              key={reason}
              type="button"
              disabled={isLeaderOf}
              onClick={() => voteForEvent(eventId, reason)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                vote?.mine
                  ? "border-terracotta bg-terracotta/10"
                  : "border-border bg-background hover:border-terracotta/40",
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-sm font-bold">
                {vote?.count ?? 0}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{reason}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", vote?.mine ? "bg-terracotta" : "bg-sage")}
                    style={{ width: ${"`"}${"${"}pct${"}"}%${"`"} }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
            </button>
          );
        })}
      </div>
      {isLeaderOf ? (
        <p className="rounded-xl bg-sage/10 px-3 py-2 text-xs text-sage">
          Lider olarak son kararı sen veriyorsun — menü, kalabalık, bütçe ve konum oylarını değerlendir.
        </p>
      ) : null}
    </div>
  );
}
`;

src = src.slice(0, firstPoll) + cleanPoll + "\n" + src.slice(mapEnd);
writeFileSync(app, src, "utf8");
console.log("POLLPANEL-TEK=" + firstPoll + ".." + mapEnd);
