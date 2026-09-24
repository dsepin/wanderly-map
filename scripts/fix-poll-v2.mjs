import { readFileSync, writeFileSync } from "node:fs";

const app = new URL("../src/components/globetrotter-app.tsx", import.meta.url);
let src = readFileSync(app, "utf8");

const startM = src.indexOf("function PollPanel({ eventId }: { eventId: string }) {");
const endM = src.indexOf("function MapSkeleton() {");
if (startM < 0 || endM < 0 || endM <= startM) {
  console.error("ANCHOR-FAIL start=" + startM + " end=" + endM);
  process.exit(1);
}

// Crown import'u kontrol
if (!src.includes("  Crown,")) {
  if (src.includes("  BellRing,")) {
    src = src.replace("  BellRing,\n", "  BellRing,\n  Crown,\n");
    console.log("CROWN-ADDED");
  } else {
    console.error("CROWN-ANCHOR-FAIL");
  }
}

const clean = `function PollPanel({ eventId }: { eventId: string }) {
  const {
    friendVotes,
    voteForEvent,
    leaderEventIds,
    allEvents,
    travelers,
    joinedEventIds,
  } = useGlobeTrotter();
  const event = allEvents.find((item) => item.id === eventId);
  if (!event) return null;
  const votes = friendVotes[eventId] ?? [];
  const totalVotes = votes.reduce((sum, vote) => sum + vote.count, 0);
  const isLeader = leaderEventIds.includes(eventId);
  const isJoined = joinedEventIds.includes(eventId);
  const leaderTraveler = travelers.find((t) => t.id === event.hostId);
  void leaderTravelerimar;
  const REASONS = ["Menü", "Kalabalık", "Bütçe", "Konum"] as const;
  const pctFor = (reason: string) => {
    const vote = votes.find((v) => v.reason === reason);
    return totalVotes > 0 ? Math.round(((vote?.count ?? 0) / totalVotes) * 100) : 0;
  };

  if (!isJoined && !isLeader) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Grup Kararı</p>
          <p className="text-xs text-muted-foreground">
            {isLeader
              ? "Sen lider oldun — kararı sen veriyorsun."
              : "İstek yollayan ilk kişi lider seçildi. Oyunu ver."}
          </p>
        </div>
        {isLeader ? (
          <span className="flex items-center gap-1.5 rounded-full bg-terracotta/15 px-2.5 py-1 text-xs font-bold text-terracotta">
            <Crown className="size-3.5" /> Lider
          </span>
        ) : null}
      </div>
      <div className="grid gap-2">
        {REASONS.map((reason) => {
          const pct = pctFor(reason);
          const vote = votes.find((v) => v.reason === reason);
          return (
            <button
              key={reason}
              type="button"
              disabled={isLeader}
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
                    style={{ width: pct + "%" }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
            </button>
          );
        })}
      </div>
      {isLeader ? (
        <p className="rounded-xl bg-sage/10 px-3 py-2 text-xs text-sage">
          Lider olarak kararı sen veriyorsun — menü, kalabalık, bütçe ve konum oylarını değerlendir.
        </p>
      ) : null}
    </div>
  );
}

`;

src = src.slice(0, startM) + clean + src.slice(endM);
writeFileSync(app, src, "utf8");
console.log("POLLPANEL-V2-OK start=" + startM + " end=" + endM);
