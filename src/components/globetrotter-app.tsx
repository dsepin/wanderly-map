import { ClientOnly } from "@tanstack/react-router";
import {
  Bell,
  BellRing,
  CalendarDays,
  ChevronDown,
  Compass,
  Croissant,
  Globe2,
  Grid2X2,
  Crown,
  Heart,
  ImagePlus,
  Landmark,
  Layers3,
  LayoutList,
  LocateFixed,
  Map,
  MapPin,
  MessageCircle,
  Moon,
  Mountain,
  Pin,
  Plus,
  Radar,
  Route,
  Search,
  Send,
  Star,
  Sun,
  UserRound,
  Users,
  Wallet,
  WalletCards,
  X,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobeTrotterProvider, useGlobeTrotter } from "@/contexts/globetrotter-context";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { EventCategory, TravelEvent } from "@/lib/globetrotter-data";
import { venueStories } from "@/lib/globetrotter-data";
import {
  BUDGET_LEVELS,
  FILTER_GROUPS,
  MUSIC_STYLES,
  PRESETS,
  haversineKm,
  styleMatchScore,
  type FacetGroupId,
} from "@/lib/discovery";
import { cn } from "@/lib/utils";

const TravelMap = lazy(() => import("@/components/travel-map"));

const navItems = [
  { label: "Feed", icon: Bell, target: "feed" },
  { label: "Map", icon: Map, target: "map" },
  { label: "Events", icon: CalendarDays, target: "events" },
  { label: "Itinerary", icon: Route, target: "itinerary" },
  { label: "Profile", icon: UserRound, target: "top" },
];

function scrollToSection(target: string) {
  if (typeof document === "undefined") return;
  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const categoryIcons: Record<EventCategory, typeof Compass> = {
  Nightlife: Moon,
  Hiking: Compass,
  Cultural: Globe2,
  Foodie: WalletCards,
  Budget: Heart,
  Extreme: LocateFixed,
  Wellness: Sun,
};

function GlobeTrotterApp() {
  return (
    <GlobeTrotterProvider>
      <GlobeTrotterExperience />
    </GlobeTrotterProvider>
  );
}

function GlobeTrotterExperience() {
  const { selectedEvent } = useGlobeTrotter();
  const [venueOpen, setVenueOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="travel-shell relative min-h-screen">
        <TopNavigation />
        <div className="relative z-10 grid min-h-screen grid-cols-1 pt-24 lg:grid-cols-[minmax(380px,40%)_minmax(0,60%)] lg:pt-0">
          <Sidebar />
          <MapStage onVenueOpen={() => setVenueOpen(true)} />
        </div>
        <MobileEventDrawer open={Boolean(selectedEvent)} onVenueOpen={() => setVenueOpen(true)} />
        <VenueDetailDialog
          open={venueOpen}
          event={selectedEvent}
          onClose={() => setVenueOpen(false)}
        />
        <EventChatDialog />
        <MobileBottomNav />
      </div>
    </main>
  );
}

function TopNavigation() {
  const {
    theme,
    setTheme,
    session,
    searchQuery,
    setSearchQuery,
    allEvents,
    setSelectedEventId,
    pickMode,
    setPickMode,
    toggleFacetParent,
    setFreeOnly,
    facets,
  } = useGlobeTrotter();
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    if (typeof window === "undefined") return;
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch {
      /* misafir modu: Google oturumu yok */
    }
  };

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return allEvents
      .filter((event) =>
        [event.title, event.city, event.country, ...event.tags]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 6);
  }, [allEvents, searchQuery]);

  const quickFilters = [
    {
      key: "yemek",
      label: "Yeme & İçme",
      icon: Croissant,
      childIds: ["gastronomi", "sokak", "restoran"],
    },
    {
      key: "doga",
      label: "Doğa & Yürüyüş",
      icon: Mountain,
      childIds: ["trekking", "park", "bisiklet"],
    },
    {
      key: "kultur",
      label: "Kültür & Sanat",
      icon: Landmark,
      childIds: ["muze", "tiyatro", "sergi", "galeri"],
    },
    {
      key: "gece",
      label: "Gece Hayatı",
      icon: Moon,
      childIds: ["canli-muzik", "dj", "club", "pub", "sahil"],
    },
  ];

  return (
    <header
      id="top"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col gap-2 rounded-2xl border border-glass-border bg-glass px-3 py-3 shadow-glass backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center gap-2 px-2">
            <div className="grid size-10 place-items-center rounded-xl bg-terracotta text-terracotta-foreground shadow-travel">
              <Globe2 className="size-5" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-semibold">GlobeTrotter</p>
              <p className="text-xs text-muted-foreground">Live travel atlas</p>
            </div>
          </div>

          <div className="relative min-w-0 flex-1">
            <label className="flex items-center gap-2 rounded-xl border border-input bg-background/70 px-3 py-2 text-sm shadow-sm backdrop-blur-xl">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                aria-label="Search destinations"
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search Tokyo, tapas, hidden trails..."
                value={searchQuery}
                onFocus={() => setAutocompleteOpen(true)}
                onBlur={() => window.setTimeout(() => setAutocompleteOpen(false), 200)}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </label>
            {autocompleteOpen && suggestions.length > 0 ? (
              <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-glass backdrop-blur-2xl">
                {suggestions.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-accent"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery(event.title);
                      setSelectedEventId(event.id);
                      setAutocompleteOpen(false);
                    }}
                  >
                    <img src={event.image} alt="" className="size-9 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{event.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {event.city}, {event.country}
                      </span>
                    </span>
                    <MapPin className="size-4 text-terracotta" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Button
            variant={pickMode ? "warm" : "glass"}
            size="sm"
            aria-label="Haritaya tıklayarak etkinlik yerleştir"
            onClick={() => setPickMode(!pickMode)}
          >
            <Pin className="size-4" />
            <span className="hidden xl:inline">
              {pickMode ? "Tıklama aktif" : "Haritaya Tıkla"}
            </span>
          </Button>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="GlobeTrotter sections">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  variant="nav"
                  size="sm"
                  aria-label={item.label}
                  onClick={() => scrollToSection(item.target)}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <Button
            variant="glass"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {session ? (
            <Button
              variant="sage"
              size="sm"
              onClick={() => {
                try {
                  void supabase.auth.signOut();
                } catch {
                  /* misafir modu */
                }
              }}
            >
              <UserRound className="size-4" />
              <span className="hidden sm:inline">Signed in</span>
            </Button>
          ) : (
            <AuthDialog onGoogleSignIn={handleGoogleSignIn} />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:flex">
            <Layers3 className="size-3.5" /> Hızlı filtre
          </span>
          {quickFilters.map((filter) => {
            const Icon = filter.icon;
            const active = facets.experience.some((f) => filter.childIds.includes(f));
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => toggleFacetParent("experience", filter.childIds)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                  active
                    ? "border-terracotta bg-terracotta text-terracotta-foreground shadow-travel"
                    : "border-border bg-background/70 text-muted-foreground hover:border-terracotta/50 hover:text-foreground",
                )}
                aria-pressed={active}
              >
                <Icon className="size-3.5" />
                {filter.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setFreeOnly(!facets.freeOnly)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
              facets.freeOnly
                ? "border-terracotta bg-terracotta text-terracotta-foreground shadow-travel"
                : "border-border bg-background/70 text-muted-foreground hover:border-terracotta/50 hover:text-foreground",
            )}
            aria-pressed={facets.freeOnly}
          >
            <Wallet className="size-3.5" />
            Ücretsiz
          </button>
        </div>
      </div>
    </header>
  );
}

function AuthDialog({ onGoogleSignIn }: { onGoogleSignIn: () => Promise<void> }) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Checking your travel pass...");
    try {
      const result =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setStatus(result.error.message);
        return;
      }

      setStatus(mode === "sign-up" ? "Check your email to confirm your account." : "Welcome back.");
    } catch {
      setStatus("Supabase bağlı değil — misafir modunda devam ediyorsun.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="warm" size="sm">
          <UserRound className="size-4" />
          Join
        </Button>
      </DialogTrigger>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Your travel circle</DialogTitle>
          <DialogDescription>
            Save trips, join events, and coordinate with nearby travelers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Button variant="glass" className="w-full" onClick={() => void onGoogleSignIn()}>
            <Globe2 className="size-4" />
            Continue with Google
          </Button>
          <div className="flex rounded-xl bg-muted p-1">
            <Button
              type="button"
              variant={mode === "sign-in" ? "secondary" : "ghost"}
              className="flex-1"
              onClick={() => setMode("sign-in")}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === "sign-up" ? "secondary" : "ghost"}
              className="flex-1"
              onClick={() => setMode("sign-up")}
            >
              Sign up
            </Button>
          </div>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <input
              aria-label="Email address"
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
              required
            />
            <input
              aria-label="Password"
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              value={password}
              required
            />
            <Button variant="warm" type="submit">
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </Button>
          </form>
          {status ? (
            <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{status}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Sidebar() {
  return (
    <aside className="relative z-20 hidden max-h-screen overflow-y-auto border-r border-border/70 bg-background/90 px-6 pb-10 pt-28 shadow-panel backdrop-blur-2xl lg:block">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <SidebarHero />
        <FiltersPanel />
        <EventHub />
        <ItineraryPanel />
      </div>
    </aside>
  );
}

function SidebarHero() {
  const { filteredEvents, travelers, radarEnabled, setRadarEnabled } = useGlobeTrotter();
  const liveCount = travelers.filter((traveler) => traveler.openToMeet).length;

  return (
    <section className="rounded-3xl border border-glass-border bg-glass p-5 shadow-glass backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-terracotta">Editorial Travel mode</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
            Find your next circle anywhere.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Events, open-to-meet travelers, and collaborative plans are layered over one living
            world map.
          </p>
        </div>
        <div className="rounded-2xl bg-sage/15 p-3 text-sage">
          <Compass className="size-6" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Events" value={filteredEvents.length.toString()} />
        <Metric label="Travelers" value={travelers.length.toString()} />
        <Metric label="Live" value={liveCount.toString()} />
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-background/60 p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-radar text-radar-foreground">
            <Radar className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Traveler Radar</p>
            <p className="text-xs text-muted-foreground">Opt-in nearby availability</p>
          </div>
        </div>
        <Switch
          checked={radarEnabled}
          onCheckedChange={setRadarEnabled}
          aria-label="Toggle traveler radar"
        />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/70 p-3 text-center shadow-sm">
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-terracotta bg-terracotta text-terracotta-foreground shadow-travel"
          : "border-border bg-background text-muted-foreground hover:border-terracotta/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="grid min-w-6 place-items-center rounded-full bg-terracotta px-1.5 py-0.5 text-[11px] font-bold text-terracotta-foreground">
      {count}
    </span>
  );
}

/** Tarz Uyumu Oranı + o geceye özel müzik tarzları */
function MatchLine({ eventId }: { eventId: string }) {
  const { allEvents, facets, totalFacetCount } = useGlobeTrotter();
  const event = allEvents.find((e) => e.id === eventId);
  if (!event) return null;
  const music = MUSIC_STYLES[eventId];
  if (totalFacetCount === 0 && !music) return null;
  const score = styleMatchScore(event, facets);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {totalFacetCount > 0 ? (
        <span className="rounded-full bg-sage/15 px-3 py-1 font-bold text-sage">
          Tarz Uyumu %{score.pct}
        </span>
      ) : null}
      {music ? (
        <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
          Bu gece: {music.join(" • ")}
        </span>
      ) : null}
    </div>
  );
}

function FiltersPanel() {
  const {
    facets,
    toggleFacet,
    toggleFacetParent,
    setFreeOnly,
    applyPreset,
    clearFacetFilters,
    clearFilters,
    facetCount,
    totalFacetCount,
    filteredEvents,
    radiusKm,
    setRadiusKm,
  } = useGlobeTrotter();
  const [openGroup, setOpenGroup] = useState<FacetGroupId | null>("experience");

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-2xl font-semibold">Filtrele</h2>
          <CountBadge count={totalFacetCount} />
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Temizle
        </Button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Hızlı tarz seçimi
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <FilterChip key={preset.id} active={false} onClick={() => applyPreset(preset.id)}>
              {preset.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {FILTER_GROUPS.map((group) => (
          <Collapsible
            key={group.id}
            open={openGroup === group.id}
            onOpenChange={(open) => setOpenGroup(open ? group.id : null)}
            className="overflow-hidden rounded-2xl border border-border bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 p-3 text-left">
              <span>
                <span className="block text-sm font-semibold">{group.title}</span>
                <span className="block text-xs text-muted-foreground">{group.hint}</span>
              </span>
              <span className="flex items-center gap-2">
                <CountBadge count={facetCount(group.id)} />
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    openGroup === group.id && "rotate-180",
                  )}
                />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              {group.parents?.map((parent) => {
                const list = facets[group.id] as string[];
                const selected = parent.children.filter((c) => list.includes(c.id));
                return (
                  <div key={parent.id} className="mt-2 rounded-xl bg-muted/60 p-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-1 py-1 text-left text-[13px] font-semibold"
                      onClick={() =>
                        toggleFacetParent(
                          group.id,
                          parent.children.map((c) => c.id),
                        )
                      }
                    >
                      <span>
                        {parent.label}{" "}
                        <span className="font-normal text-muted-foreground">
                          ({selected.length}/{parent.children.length})
                        </span>
                      </span>
                      <span className="text-xs font-medium text-terracotta">
                        {selected.length === parent.children.length ? "Bırak" : "Tümü"}
                      </span>
                    </button>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {parent.children.map((child) => (
                        <FilterChip
                          key={child.id}
                          active={list.includes(child.id)}
                          onClick={() => toggleFacet(group.id, child.id)}
                        >
                          {child.label}
                        </FilterChip>
                      ))}
                    </div>
                  </div>
                );
              })}

              {group.singles && group.custom !== "time" ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.singles.map((single) => {
                    const list = facets[group.id] as string[];
                    return (
                      <FilterChip
                        key={single.id}
                        active={list.includes(single.id)}
                        onClick={() => toggleFacet(group.id, single.id)}
                      >
                        {single.label}
                      </FilterChip>
                    );
                  })}
                </div>
              ) : null}

              {group.custom === "budget" ? (
                <div className="mt-2 grid gap-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-sm font-medium">
                    <span>Ücretsiz etkinlikler</span>
                    <Switch
                      checked={facets.freeOnly}
                      onCheckedChange={setFreeOnly}
                      aria-label="Ücretsiz etkinlikler"
                    />
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BUDGET_LEVELS.map((level) => (
                      <FilterChip
                        key={level.level}
                        active={facets.budget.includes(level.level)}
                        onClick={() => toggleFacet("budget", level.level)}
                      >
                        {level.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>
              ) : null}

              {group.custom === "time" ? (
                <div className="mt-2 grid gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {group.singles?.map((single) => (
                      <FilterChip
                        key={single.id}
                        active={facets.time.includes(single.id)}
                        onClick={() => toggleFacet("time", single.id)}
                      >
                        {single.label}
                      </FilterChip>
                    ))}
                  </div>
                  <RangeControl
                    label="Mesafe yarıçapı"
                    value={radiusKm}
                    suffix="km"
                    min={1}
                    max={20}
                    onChange={setRadiusKm}
                  />
                </div>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={clearFacetFilters}>
          Tümünü Temizle
        </Button>
        <Button variant="warm" onClick={() => scrollToSection("map")}>
          {filteredEvents.length} Etkinlik Göster
        </Button>
      </div>
    </section>
  );
}

function RangeControl({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} {suffix}
        </span>
      </span>
      <input
        className="accent-sage"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function EventHub() {
  const {
    allEvents,
    facets,
    filteredEvents,
    selectedEventId,
    setSelectedEventId,
    viewMode,
    setViewMode,
    clearFilters,
    clearFacetFilters,
    searchQuery,
    mapCenter,
  } = useGlobeTrotter();
  const nearMatches = useMemo(
    () =>
      allEvents
        .map((event) => ({ event, score: styleMatchScore(event, facets) }))
        .filter((item) => item.score.total > 0 && item.score.pct < 100)
        .sort((a, b) => b.score.pct - a.score.pct)
        .slice(0, 3),
    [allEvents, facets],
  );

  return (
    <section
      id="events"
      className="scroll-mt-28 rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-terracotta">Event & activity hub</p>
          <h2 className="font-display text-2xl font-semibold">Happening soon</h2>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid")}>
            <TabsList>
              <TabsTrigger value="list" aria-label="List view">
                <LayoutList className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Grid view">
                <Grid2X2 className="size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <CreateEventDialog />
        </div>
      </div>
      <div className={cn("mt-4 grid gap-3", viewMode === "grid" && "grid-cols-2")}>
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center">
            <MapPin className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">
              No trips match{searchQuery ? ` “${searchQuery}”` : ""}.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening the radius, raising the price cap, or clearing the search.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
            {nearMatches.length > 0 ? (
              <div className="mt-5 border-t border-border pt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sana en yakın sonuçlar
                </p>
                <div className="mt-2 grid gap-2">
                  {nearMatches.map(({ event, score }) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        clearFacetFilters();
                        setSelectedEventId(event.id);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 text-left transition hover:border-terracotta"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="size-12 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{event.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {event.city} · Tarz Uyumu %{score.pct}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {filteredEvents.map((event) => {
          const distKm = haversineKm(mapCenter, event.coordinates);
          return (
            <article
              key={event.id}
              className={cn(
                "group cursor-pointer overflow-hidden rounded-2xl border bg-background shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-card",
                selectedEventId === event.id ? "border-terracotta" : "border-border",
              )}
              onClick={() => setSelectedEventId(event.id)}
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-xl">
                  {distKm.toFixed(1)} km
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-terracotta">
                      {event.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-4" /> {event.city}, {event.country}
                    </p>
                  </div>
                  <span className="rounded-full bg-sage/15 px-2 py-1 text-xs font-semibold text-sage">
                    {event.price === 0 ? "Free" : `${event.price} ${event.currency}`}
                  </span>
                </div>
                <p className="text-sm leading-5 text-muted-foreground">{event.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3" /> {event.date} · {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {event.attendees}/{event.maxAttendees}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3 text-ochre" /> {event.rating}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CreateEventDialog() {
  const { addEvent, createOpen, setCreateOpen, createCoordinates, setCreateCoordinates } =
    useGlobeTrotter();
  const [step, setStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState({
    title: "",
    city: "Istanbul",
    country: "Türkiye",
    category: "Cultural" as EventCategory,
    date: "Oct 08",
    time: "18:30",
    price: 18,
    description: "",
    coordinates: [41.0082, 28.9784] as [number, number],
  });

  const handleCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);
  };

  const handleOpenChange = (next: boolean) => {
    setCreateOpen(next);
    if (next) {
      setDraft((current) => ({ ...current, coordinates: createCoordinates }));
      setStep(1);
    }
  };

  const handleCreate = () => {
    addEvent({ ...draft, coverPreview });
    setCreateOpen(false);
    setStep(1);
  };

  return (
    <Dialog open={createOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="warm" size="icon" aria-label="Create event">
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create a travel event</DialogTitle>
          <DialogDescription>
            Drop a pin, set the vibe, and invite nearby travelers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={cn("h-2 rounded-full", item <= step ? "bg-terracotta" : "bg-muted")}
              />
            ))}
          </div>

          {step === 1 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                Event name
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Sunset ferry photo walk"
                  value={draft.title}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                City
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, city: event.target.value }))
                  }
                  value={draft.city}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Country
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, country: event.target.value }))
                  }
                  value={draft.country}
                />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium">
                Category
                <select
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      category: event.target.value as EventCategory,
                    }))
                  }
                  value={draft.category}
                >
                  {Object.keys(categoryIcons).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Date
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, date: event.target.value }))
                  }
                  value={draft.date}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Time
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, time: event.target.value }))
                  }
                  value={draft.time}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium sm:col-span-3">
                Description
                <textarea
                  className="min-h-28 rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Describe the experience, meeting point, and who should join."
                  value={draft.description}
                />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
              <div className="rounded-2xl border border-border bg-muted p-4">
                <p className="text-sm font-semibold">Pin preview</p>
                <div className="relative mt-3 h-52 overflow-hidden rounded-2xl bg-map-preview">
                  <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-terracotta text-terracotta-foreground shadow-travel">
                    <MapPin className="size-5" />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-xl bg-glass px-3 py-2 text-xs shadow-glass backdrop-blur-xl">
                    {draft.city}, {draft.country}
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  {coverPreview ? (
                    <img src={coverPreview} alt="" className="h-36 w-full object-cover" />
                  ) : (
                    <div className="grid h-36 place-items-center bg-muted text-muted-foreground">
                      <ImagePlus className="size-8" />
                    </div>
                  )}
                  <div className="p-3">
                    <input
                      ref={fileInputRef}
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleCover}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="size-4" />
                      Cover photo
                    </Button>
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Price
                  <input
                    className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    min={0}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, price: Number(event.target.value) }))
                    }
                    type="number"
                    value={draft.price}
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button variant="warm" onClick={() => setStep((current) => Math.min(3, current + 1))}>
                Next
              </Button>
            ) : (
              <Button variant="warm" onClick={handleCreate} disabled={!draft.title.trim()}>
                Create event
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ItineraryPanel() {
  const { selectedEvent, filteredEvents } = useGlobeTrotter();
  const [shareLabel, setShareLabel] = useState("Share");
  const itinerary = useMemo(
    () =>
      [
        selectedEvent,
        ...filteredEvents.filter((event) => event.id !== selectedEvent?.id).slice(0, 3),
      ].filter(Boolean),
    [filteredEvents, selectedEvent],
  );
  const planCity = selectedEvent?.city ?? filteredEvents[0]?.city;

  const handleShare = async () => {
    try {
      const link = `${window.location.origin}${window.location.pathname}#itinerary`;
      await navigator.clipboard.writeText(link);
      setShareLabel("Copied!");
    } catch {
      setShareLabel("Copy failed");
    }
    window.setTimeout(() => setShareLabel("Share"), 2000);
  };

  return (
    <section
      id="itinerary"
      className="scroll-mt-28 rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sage">Collaborative itinerary</p>
          <h2 className="font-display text-2xl font-semibold">
            {planCity ? `${planCity} sprint` : "Your trip"}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => void handleShare()}>
          {shareLabel}
        </Button>
      </div>
      <div className="mt-4 grid gap-3">
        {itinerary.map((event, index) =>
          event ? (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-muted font-semibold">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  Day {index + 1} · {event.time} · {event.city}
                </p>
              </div>
              <Route className="size-4 text-sage" />
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}

function MapStage({ onVenueOpen }: { onVenueOpen: () => void }) {
  const {
    selectedEvent,
    mapStyle,
    setMapStyle,
    filteredEvents,
    feed,
    joinEvent,
    joinedEventIds,
    savedEventIds,
    toggleSave,
    remindEventIds,
    requestEventIds,
    approvedEventIds,
    toggleRemind,
    sendJoinRequest,
    approveJoinRequest,
    openChat,
  } = useGlobeTrotter();
  const isJoined = selectedEvent ? joinedEventIds.includes(selectedEvent.id) : false;
  const isSaved = selectedEvent ? savedEventIds.includes(selectedEvent.id) : false;
  const isReminded = selectedEvent ? remindEventIds.includes(selectedEvent.id) : false;
  const isRequested = selectedEvent ? requestEventIds.includes(selectedEvent.id) : false;
  const isApproved = selectedEvent ? approvedEventIds.includes(selectedEvent.id) : false;

  return (
    <section
      id="map"
      className="relative isolate min-h-[calc(100vh-6rem)] scroll-mt-20 overflow-hidden lg:min-h-screen"
    >
      <ClientOnly fallback={<MapSkeleton />}>
        <Suspense fallback={<MapSkeleton />}>
          <TravelMap />
        </Suspense>
      </ClientOnly>
      <StoryBar />
      <div className="pointer-events-none absolute inset-x-4 top-24 z-10 flex flex-wrap items-start justify-between gap-3 lg:top-28">
        <div className="pointer-events-auto rounded-2xl border border-glass-border bg-glass p-2 shadow-glass backdrop-blur-2xl">
          <div className="flex flex-wrap gap-2">
            {(["Vintage Travel", "Dark Minimal", "Satellite"] as const).map((style) => (
              <Button
                key={style}
                variant={mapStyle === style ? "warm" : "glass"}
                size="sm"
                onClick={() => setMapStyle(style)}
              >
                <Layers3 className="size-4" />
                {style}
              </Button>
            ))}
          </div>
        </div>
        <div
          id="feed"
          className="pointer-events-auto hidden w-80 scroll-mt-28 rounded-3xl border border-glass-border bg-glass p-4 shadow-glass backdrop-blur-2xl xl:block"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Live activity feed</p>
              <p className="text-xs text-muted-foreground">Nearby updates</p>
            </div>
            <Bell className="size-5 text-terracotta" />
          </div>
          <div className="mt-3 grid gap-2">
            {feed.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-background/70 p-3 text-sm shadow-sm">
                <span className="font-semibold">{item.actor}</span> {item.action}{" "}
                <span className="text-sage">{item.place}</span>
                <p className="mt-1 text-xs text-muted-foreground">{item.minutesAgo} min ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedEvent ? (
        <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-10 hidden justify-center lg:flex">
          <div className="pointer-events-auto grid w-full max-w-3xl grid-cols-[180px_1fr] overflow-hidden rounded-3xl border border-glass-border bg-glass shadow-glass backdrop-blur-2xl">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="h-full min-h-44 object-cover"
            />
            <div className="grid gap-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-terracotta">
                    {selectedEvent.category}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">
                    {selectedEvent.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedEvent.city}, {selectedEvent.country}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/70 px-3 py-2 text-sm font-semibold shadow-sm">
                  {filteredEvents.length} matches
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{selectedEvent.description}</p>
              <MatchLine eventId={selectedEvent.id} />
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="warm"
                  disabled={isJoined}
                  onClick={() => joinEvent(selectedEvent.id)}
                >
                  <Users className="size-4" /> {isJoined ? "Joined" : "Join trip"}
                </Button>
                <Button variant="glass" onClick={() => toggleSave(selectedEvent.id)}>
                  <Heart className={cn("size-4", isSaved && "fill-terracotta text-terracotta")} />{" "}
                  {isSaved ? "Saved" : "Save"}
                </Button>
                {selectedEvent.venue ? (
                  <Button variant="glass" onClick={onVenueOpen}>
                    <MapPin className="size-4" /> Mekan Detayı
                  </Button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
                <Button
                  variant="glass"
                  onClick={() => sendJoinRequest(selectedEvent.id)}
                  disabled={isRequested || isApproved}
                >
                  <Send className="size-4" />
                  {isApproved ? "Onaylandı ✓" : isRequested ? "İstek gönderildi" : "İstek Yolla"}
                </Button>
                <Button variant="glass" onClick={() => toggleRemind(selectedEvent.id)}>
                  <BellRing className={cn("size-4", isReminded && "text-terracotta")} />
                  {isReminded ? "Hatırlatıldı" : "Hatırlat"}
                </Button>
                <Button
                  variant="glass"
                  onClick={() => openChat(selectedEvent.id)}
                  disabled={!isApproved}
                  title={isApproved ? "Sohbeti aç" : "Onaydan sonra açılır"}
                >
                  <MessageCircle className="size-4" /> Chat
                </Button>
                {isRequested && !isApproved ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-sage/50 px-3 py-2 text-xs text-sage transition hover:bg-sage/10"
                    onClick={() => approveJoinRequest(selectedEvent.id)}
                  >
                    <UserRound className="size-3.5" />
                    Organizatör yanıtlıyor… (Onayı simüle et)
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PollPanel({ eventId }: { eventId: string }) {
  const { friendVotes, voteForEvent, leaderEventIds, allEvents, travelers, joinedEventIds } =
    useGlobeTrotter();
  const event = allEvents.find((item) => item.id === eventId);
  if (!event) return null;
  const votes = friendVotes[eventId] ?? [];
  const totalVotes = votes.reduce((sum, vote) => sum + vote.count, 0);
  const isLeader = leaderEventIds.includes(eventId);
  const isJoined = joinedEventIds.includes(eventId);
  const leaderTraveler = travelers.find((t) => t.id === event.hostId);
  void leaderTraveler;
  const REASONS = ["Menü", "Kalabalık", "Bütçe", "Konum"] as const;
  const totalVotesAll = totalVotes;
  void totalVotesAll;

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
          const vote = votes.find((item) => item.reason === reason);
          const pct = totalVotes > 0 ? Math.round(((vote?.count ?? 0) / totalVotes) * 100) : 0;
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
                    className={cn(
                      "h-full rounded-full transition-all",
                      vote?.mine ? "bg-terracotta" : "bg-sage",
                    )}
                    style={{ width: `${pct}%` }}
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

function MapSkeleton() {
  return (
    <div className="grid h-full min-h-[calc(100vh-6rem)] place-items-center bg-map-preview lg:min-h-screen">
      <div className="rounded-3xl border border-glass-border bg-glass p-5 text-center shadow-glass backdrop-blur-2xl">
        <Map className="mx-auto size-8 text-terracotta" />
        <p className="mt-3 font-display text-xl font-semibold">Preparing your atlas</p>
      </div>
    </div>
  );
}

function MobileEventDrawer({ open, onVenueOpen }: { open: boolean; onVenueOpen: () => void }) {
  const {
    selectedEvent,
    setSelectedEventId,
    joinEvent,
    joinedEventIds,
    savedEventIds,
    toggleSave,
    remindEventIds,
    requestEventIds,
    approvedEventIds,
    toggleRemind,
    sendJoinRequest,
    approveJoinRequest,
    openChat,
  } = useGlobeTrotter();
  const isJoined = selectedEvent ? joinedEventIds.includes(selectedEvent.id) : false;
  const isSaved = selectedEvent ? savedEventIds.includes(selectedEvent.id) : false;
  const isReminded = selectedEvent ? remindEventIds.includes(selectedEvent.id) : false;
  const isRequested = selectedEvent ? requestEventIds.includes(selectedEvent.id) : false;
  const isApproved = selectedEvent ? approvedEventIds.includes(selectedEvent.id) : false;

  return (
    <Drawer
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setSelectedEventId("");
      }}
    >
      <DrawerContent className="max-h-[64vh] border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl lg:hidden">
        {selectedEvent ? (
          <>
            <DrawerHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DrawerTitle className="font-display text-2xl">{selectedEvent.title}</DrawerTitle>
                  <DrawerDescription>
                    {selectedEvent.city}, {selectedEvent.country} · {selectedEvent.date} ·{" "}
                    {selectedEvent.time}
                  </DrawerDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close details"
                  onClick={() => setSelectedEventId("")}
                >
                  <X className="size-5" />
                </Button>
              </div>
            </DrawerHeader>
            <div className="grid gap-4 px-4 pb-6">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="h-36 w-full rounded-2xl object-cover"
              />
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3 text-ochre" /> {selectedEvent.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" /> {selectedEvent.attendees}/
                  {selectedEvent.maxAttendees}
                </span>
                <span className="rounded-full bg-sage/15 px-2 py-1 font-semibold text-sage">
                  {selectedEvent.price === 0
                    ? "Free"
                    : `${selectedEvent.price} ${selectedEvent.currency}`}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="warm"
                  disabled={isJoined}
                  onClick={() => joinEvent(selectedEvent.id)}
                >
                  <Users className="size-4" /> {isJoined ? "Joined" : "Join"}
                </Button>
                <Button variant="outline" onClick={() => toggleSave(selectedEvent.id)}>
                  <Heart className={cn("size-4", isSaved && "fill-terracotta text-terracotta")} />{" "}
                  {isSaved ? "Saved" : "Save"}
                </Button>
                {selectedEvent.venue ? (
                  <Button variant="outline" className="col-span-2" onClick={onVenueOpen}>
                    <MapPin className="size-4" /> Mekan Detayı
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  onClick={() => sendJoinRequest(selectedEvent.id)}
                  disabled={isRequested || isApproved}
                >
                  <Send className="size-4" />
                  {isApproved ? "Onaylandı ✓" : isRequested ? "İstek gönderildi" : "İstek Yolla"}
                </Button>
                <Button variant="outline" onClick={() => toggleRemind(selectedEvent.id)}>
                  <BellRing className={cn("size-4", isReminded && "text-terracotta")} />
                  {isReminded ? "Hatırlatıldı" : "Hatırlat"}
                </Button>
                {isRequested && !isApproved ? (
                  <Button
                    variant="outline"
                    className="col-span-2"
                    onClick={() => approveJoinRequest(selectedEvent.id)}
                  >
                    <UserRound className="size-4" /> Organizatör onayını simüle et
                  </Button>
                ) : null}
                {isApproved ? (
                  <Button
                    variant="outline"
                    className="col-span-2"
                    onClick={() => openChat(selectedEvent.id)}
                  >
                    <MessageCircle className="size-4" /> Sohbeti aç
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

function VenueDetailDialog({
  open,
  event,
  onClose,
}: {
  open: boolean;
  event: TravelEvent | undefined;
  onClose: () => void;
}) {
  const venue = event?.venue;
  const occupiedTables = venue ? venue.tables.filter((t) => t.occupied).length : 0;
  const occupancyPct = venue
    ? Math.round((venue.occupancy.current / venue.occupancy.capacity) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {venue?.name ?? "Mekan Detayı"}
          </DialogTitle>
          <DialogDescription>{event?.title} · Canlı doluluk ve rezervasyon</DialogDescription>
        </DialogHeader>
        {venue ? (
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Canlı Doluluk</p>
                  <p className="text-xs text-muted-foreground">
                    {venue.occupancy.current} / {venue.occupancy.capacity} kişi
                  </p>
                </div>
                <span className="rounded-full bg-terracotta/15 px-3 py-1 text-sm font-bold text-terracotta">
                  %{occupancyPct}
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-terracotta transition-all"
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">Masa Krokisi</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {occupiedTables} masa dolu · {venue.tables.length - occupiedTables} masa boş
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {venue.tables.map((table) => (
                  <div
                    key={table.id}
                    className={cn(
                      "grid place-items-center rounded-xl border px-2 py-3 text-center",
                      table.occupied
                        ? "border-terracotta bg-terracotta/15 text-terracotta"
                        : "border-sage bg-sage/10 text-sage",
                    )}
                    title={table.occupied ? "Dolu" : "Boş"}
                  >
                    <p className="text-sm font-bold">{table.label}</p>
                    <p className="text-[10px] text-muted-foreground">{table.seats} kişilik</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">Menü Kartı</p>
              <div className="mt-2 grid gap-2">
                {venue.menu.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      {item.tag ? (
                        <p className="text-xs text-muted-foreground">{item.tag}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-sm font-bold text-sage">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">Yorumlar & Puanlar</p>
              <div className="mt-2 grid gap-2">
                {venue.reviews.map((review) => (
                  <div key={review.author} className="rounded-xl bg-muted/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{review.author}</p>
                      <span className="flex items-center gap-1 text-xs font-bold text-ochre">
                        <Star className="size-3 fill-ochre" /> {review.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Bu etkinliğin henüz mekan bilgisi eklenmedi.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventChatDialog() {
  const { chatEventId, closeChat, allEvents, travelers } = useGlobeTrotter();
  const [messages, setMessages] = useState<{ from: "user" | "host"; text: string }[]>([]);
  const [draftText, setDraftText] = useState("");
  const event = allEvents.find((item) => item.id === chatEventId);
  const host = event ? travelers.find((t) => t.id === event.hostId) : undefined;

  const open = Boolean(event && host);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { from: "user", text: trimmed }]);
    setDraftText("");
    // Organizatörün basit otomatik yanıtı
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          from: "host",
          text: `${host?.name ?? "Organizatör"}: Harika! ${event?.title} için seni bekliyoruz. 🌍`,
        },
      ]);
    }, 900);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      closeChat();
      setMessages([]);
      return;
    }
    if (messages.length === 0) {
      setMessages([
        {
          from: "host",
          text: `${host?.name ?? "Organizatör"}: Merhaba! ${event?.title} hakkında soruların varsa buraya yazabilirsin.`,
        },
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={host?.avatar}
              alt=""
              className="size-11 rounded-full border-2 border-sage object-cover"
            />
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl">
                {host?.name ?? "Organizatör"}
              </DialogTitle>
              <DialogDescription className="truncate">{event?.title}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                message.from === "user"
                  ? "self-end bg-terracotta text-terracotta-foreground"
                  : "self-start bg-muted text-foreground",
              )}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend(draftText);
          }}
        >
          <input
            aria-label="Sehkiz mesaj"
            className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
            placeholder="Mesaj yaz…"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
          <Button type="submit" variant="warm" size="icon" aria-label="Gönder">
            <Send className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StoryBar() {
  const { travelers, setSelectedEventId } = useGlobeTrotter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  const storyOf = (story: (typeof venueStories)[number]) =>
    travelers.find((t) => t.id === story.authorId);

  const toggleLike = (id: string) => {
    setLiked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center lg:top-24">
        <div className="pointer-events-auto flex max-w-full items-center gap-3 overflow-x-auto rounded-2xl border border-glass-border bg-glass px-3 py-2 shadow-glass backdrop-blur-2xl">
          {venueStories.map((story) => {
            const author = storyOf(story);
            const viewed = liked.includes(story.id);
            return (
              <button
                key={story.id}
                type="button"
                data-story={story.id}
                className="group flex w-16 shrink-0 flex-col items-center gap-1"
                onClick={() => setActiveId(story.id)}
              >
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-full p-[3px] transition group-hover:scale-105",
                    viewed ? "bg-border" : "bg-gradient-to-tr from-ochre via-terracotta to-sage",
                  )}
                >
                  <img
                    src={author?.avatar}
                    alt=""
                    className="size-full rounded-full border-2 border-glass object-cover"
                  />
                </span>
                <span className="max-w-full truncate text-[10px] font-semibold text-foreground/80">
                  {author?.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeId ? (
        <StoryViewer
          storyId={activeId}
          liked={liked.includes(activeId)}
          onToggleLike={() => toggleLike(activeId)}
          onClose={() => setActiveId(null)}
          onGoEvent={(eventId) => {
            setActiveId(null);
            setSelectedEventId(eventId);
          }}
        />
      ) : null}
    </>
  );
}

function StoryViewer({
  storyId,
  liked,
  onToggleLike,
  onClose,
  onGoEvent,
}: {
  storyId: string;
  liked: boolean;
  onToggleLike: () => void;
  onClose: () => void;
  onGoEvent: (eventId: string) => void;
}) {
  const { allEvents, travelers } = useGlobeTrotter();
  const [progress, setProgress] = useState(0);
  const index = venueStories.findIndex((story) => story.id === storyId);
  const story = venueStories[Math.max(0, index)];
  const author = story ? travelers.find((t) => t.id === story.authorId) : undefined;
  const event = story ? allEvents.find((item) => item.id === story.eventId) : undefined;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          return 100;
        }
        return current + 2.5;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [storyId]);

  useEffect(() => {
    if (progress >= 100 && index < venueStories.length - 1) {
      const next = venueStories[index + 1];
      if (!next) return;
      setProgress(0);
      onGoEvent(next.eventId);
      // storyId değişmeli; onClose gibi davranmak yerine viewer'ı dolaştırmak için id set edilir
      window.setTimeout(() => {
        const el = document.querySelector<HTMLButtonElement>(`[data-story="${next.id}"]`);
        el?.click();
      }, 50);
    } else if (progress >= 100) {
      onClose();
    }
  }, [progress, index, onClose, onGoEvent]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-glass-border bg-card shadow-glass">
        <div className="relative h-[70vh]">
          <img src={story.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex gap-1 p-3">
            {venueStories.map((item, i) => (
              <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 top-4 flex items-center gap-3 p-3">
            <img
              src={author?.avatar}
              alt=""
              className="size-10 rounded-full border-2 border-white/80 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white drop-shadow">{author?.name}</p>
              <p className="text-xs text-white/80">{story.minutesAgo} dk önce</p>
            </div>
            <button
              type="button"
              aria-label="Kapat"
              className="grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              onClick={onClose}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
            <p className="text-sm font-medium text-white drop-shadow">{story.caption}</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-white/80">👁 {story.views} görüntülenme</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Beğen"
                  className="grid size-10 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                  onClick={onToggleLike}
                >
                  <Heart className={cn("size-5", liked && "fill-ochre text-ochre")} />
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-white/90"
                  onClick={() => onGoEvent(story.eventId)}
                >
                  Etkinliğe git
                </button>
                {index > 0 ? (
                  <button
                    type="button"
                    data-story={storyId}
                    aria-label="Önceki story"
                    className="rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white"
                    onClick={() => {
                      const prev = venueStories[index - 1];
                      if (!prev) return;
                      setProgress(0);
                      onClose();
                      window.setTimeout(() => {
                        const el = document.querySelector<HTMLButtonElement>(
                          `[data-story="${prev.id}"]`,
                        );
                        el?.click();
                      }, 50);
                    }}
                  >
                    ← Önceki
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-glass-border bg-glass p-2 shadow-glass backdrop-blur-2xl lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.label}
              variant="nav"
              size="icon"
              aria-label={item.label}
              onClick={() => scrollToSection(item.target)}
            >
              <Icon className="size-5" />
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

export default GlobeTrotterApp;
