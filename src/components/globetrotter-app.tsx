import { ClientOnly } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  Compass,
  Filter,
  Globe2,
  Grid2X2,
  Heart,
  ImagePlus,
  Layers3,
  LayoutList,
  LocateFixed,
  Map,
  MapPin,
  MessageCircle,
  Moon,
  Plus,
  Radar,
  Route,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { lazy, Suspense, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
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
import type { EventCategory } from "@/lib/globetrotter-data";
import { cn } from "@/lib/utils";

const TravelMap = lazy(() => import("@/components/travel-map"));

const navItems = [
  { label: "Feed", icon: Bell },
  { label: "Map", icon: Map },
  { label: "Events", icon: CalendarDays },
  { label: "Itinerary", icon: Route },
  { label: "Profile", icon: UserRound },
];

const categoryIcons: Record<EventCategory, typeof Sparkles> = {
  Nightlife: Sparkles,
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

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="travel-shell relative min-h-screen">
        <TopNavigation />
        <div className="relative z-10 grid min-h-screen grid-cols-1 pt-24 lg:grid-cols-[minmax(380px,40%)_minmax(0,60%)] lg:pt-0">
          <Sidebar />
          <MapStage />
        </div>
        <MobileEventDrawer open={Boolean(selectedEvent)} />
        <MobileBottomNav />
      </div>
    </main>
  );
}

function TopNavigation() {
  const { theme, setTheme, session } = useGlobeTrotter();

  const handleGoogleSignIn = async () => {
    if (typeof window === "undefined") return;
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border border-glass-border bg-glass px-3 py-3 shadow-glass backdrop-blur-2xl">
        <div className="flex shrink-0 items-center gap-2 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-terracotta text-terracotta-foreground shadow-travel">
            <Globe2 className="size-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-semibold">GlobeTrotter</p>
            <p className="text-xs text-muted-foreground">Live travel atlas</p>
          </div>
        </div>

        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-input bg-background/70 px-3 py-2 text-sm shadow-sm backdrop-blur-xl">
          <Search className="size-4 text-muted-foreground" />
          <input
            aria-label="Search destinations"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search Tokyo, tapas, hidden trails..."
          />
        </label>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="GlobeTrotter sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button key={item.label} variant="nav" size="sm" aria-label={item.label}>
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
          <Button variant="sage" size="sm" onClick={() => void supabase.auth.signOut()}>
            <UserRound className="size-4" />
            <span className="hidden sm:inline">Signed in</span>
          </Button>
        ) : (
          <AuthDialog onGoogleSignIn={handleGoogleSignIn} />
        )}
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
    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    setStatus(mode === "sign-up" ? "Check your email to confirm your account." : "Welcome back.");
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
          <DialogDescription>Save trips, join events, and coordinate with nearby travelers.</DialogDescription>
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
          {status ? <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{status}</p> : null}
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

  return (
    <section className="rounded-3xl border border-glass-border bg-glass p-5 shadow-glass backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-terracotta">Editorial Travel mode</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">Find your next circle anywhere.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Events, open-to-meet travelers, and collaborative plans are layered over one living world map.
          </p>
        </div>
        <div className="rounded-2xl bg-sage/15 p-3 text-sage">
          <Compass className="size-6" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Events" value={filteredEvents.length.toString()} />
        <Metric label="Travelers" value={travelers.length.toString()} />
        <Metric label="Live" value="5" />
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
        <Switch checked={radarEnabled} onCheckedChange={setRadarEnabled} aria-label="Toggle traveler radar" />
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

function FiltersPanel() {
  const {
    categories,
    activeCategories,
    toggleCategory,
    clearFilters,
    radiusKm,
    setRadiusKm,
    maxPrice,
    setMaxPrice,
  } = useGlobeTrotter();

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sage">Discovery filters</p>
          <h2 className="font-display text-2xl font-semibold">Shape the map</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Reset
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const active = activeCategories.includes(category);
          return (
            <Button
              key={category}
              type="button"
              variant={active ? "sage" : "outline"}
              size="sm"
              onClick={() => toggleCategory(category)}
            >
              <Icon className="size-4" />
              {category}
            </Button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-4">
        <RangeControl label="Radius" value={radiusKm} suffix="km" min={2} max={60} onChange={setRadiusKm} />
        <RangeControl label="Price" value={maxPrice} suffix="max" min={0} max={120} onChange={setMaxPrice} />
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
  const { filteredEvents, selectedEventId, setSelectedEventId, viewMode, setViewMode } = useGlobeTrotter();

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
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
        {filteredEvents.map((event) => (
          <article
            key={event.id}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-2xl border bg-background shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-card",
              selectedEventId === event.id ? "border-terracotta" : "border-border",
            )}
            onClick={() => setSelectedEventId(event.id)}
          >
            <img src={event.image} alt="" className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-terracotta">{event.category}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{event.title}</h3>
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
                <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {event.date} · {event.time}</span>
                <span className="flex items-center gap-1"><Users className="size-3" /> {event.attendees}/{event.maxAttendees}</span>
                <span className="flex items-center gap-1"><Star className="size-3 text-ochre" /> {event.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CreateEventDialog() {
  const { addEvent } = useGlobeTrotter();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
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

  const handleCreate = () => {
    addEvent({ ...draft, coverPreview });
    setOpen(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="warm" size="icon" aria-label="Create event">
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create a travel event</DialogTitle>
          <DialogDescription>Drop a pin, set the vibe, and invite nearby travelers.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className={cn("h-2 rounded-full", item <= step ? "bg-terracotta" : "bg-muted")} />
            ))}
          </div>

          {step === 1 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                Event name
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Sunset ferry photo walk"
                  value={draft.title}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                City
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}
                  value={draft.city}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Country
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
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
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as EventCategory }))}
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
                  onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                  value={draft.date}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Time
                <input
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
                  value={draft.time}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium sm:col-span-3">
                Description
                <textarea
                  className="min-h-28 rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
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
                    <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={handleCover} />
                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
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
                    onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))}
                    type="number"
                    value={draft.price}
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between gap-3">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>
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
  const itinerary = useMemo(() => [selectedEvent, ...filteredEvents.filter((event) => event.id !== selectedEvent?.id).slice(0, 3)].filter(Boolean), [filteredEvents, selectedEvent]);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sage">Collaborative itinerary</p>
          <h2 className="font-display text-2xl font-semibold">Shared Lisbon sprint</h2>
        </div>
        <Button variant="outline" size="sm">
          Share
        </Button>
      </div>
      <div className="mt-4 grid gap-3">
        {itinerary.map((event, index) =>
          event ? (
            <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
              <div className="grid size-10 place-items-center rounded-xl bg-muted font-semibold">{index + 1}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">Day {index + 1} · {event.time} · drag-ready timeline</p>
              </div>
              <Route className="size-4 text-sage" />
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}

function MapStage() {
  const { selectedEvent, mapStyle, setMapStyle, filteredEvents, feed } = useGlobeTrotter();

  return (
    <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden lg:min-h-screen">
      <ClientOnly fallback={<MapSkeleton />}>
        <Suspense fallback={<MapSkeleton />}>
          <TravelMap />
        </Suspense>
      </ClientOnly>
      <div className="pointer-events-none absolute inset-x-4 top-24 z-[500] flex flex-wrap items-start justify-between gap-3 lg:top-28">
        <div className="pointer-events-auto rounded-2xl border border-glass-border bg-glass p-2 shadow-glass backdrop-blur-2xl">
          <div className="flex flex-wrap gap-2">
            {(["Vintage Travel", "Dark Minimal", "Satellite"] as const).map((style) => (
              <Button key={style} variant={mapStyle === style ? "warm" : "glass"} size="sm" onClick={() => setMapStyle(style)}>
                <Layers3 className="size-4" />
                {style}
              </Button>
            ))}
          </div>
        </div>
        <div className="pointer-events-auto hidden w-80 rounded-3xl border border-glass-border bg-glass p-4 shadow-glass backdrop-blur-2xl xl:block">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Live activity feed</p>
              <p className="text-xs text-muted-foreground">Realtime-ready nearby updates</p>
            </div>
            <Bell className="size-5 text-terracotta" />
          </div>
          <div className="mt-3 grid gap-2">
            {feed.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-background/70 p-3 text-sm shadow-sm">
                <span className="font-semibold">{item.actor}</span> {item.action} <span className="text-sage">{item.place}</span>
                <p className="mt-1 text-xs text-muted-foreground">{item.minutesAgo} min ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedEvent ? (
        <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-[500] hidden justify-center lg:flex">
          <div className="pointer-events-auto grid w-full max-w-3xl grid-cols-[180px_1fr] overflow-hidden rounded-3xl border border-glass-border bg-glass shadow-glass backdrop-blur-2xl">
            <img src={selectedEvent.image} alt="" className="h-full min-h-44 object-cover" />
            <div className="grid gap-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-terracotta">{selectedEvent.category}</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{selectedEvent.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedEvent.city}, {selectedEvent.country}</p>
                </div>
                <div className="rounded-2xl bg-background/70 px-3 py-2 text-sm font-semibold shadow-sm">
                  {filteredEvents.length} matches
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{selectedEvent.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="warm"><Users className="size-4" /> Join trip</Button>
                <Button variant="glass"><Heart className="size-4" /> Save</Button>
                <Button variant="glass"><MessageCircle className="size-4" /> Open chat</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
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

function MobileEventDrawer({ open }: { open: boolean }) {
  const { selectedEvent } = useGlobeTrotter();

  return (
    <Drawer open={open} modal={false}>
      <DrawerContent className="max-h-[64vh] border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl lg:hidden">
        {selectedEvent ? (
          <>
            <DrawerHeader>
              <DrawerTitle className="font-display text-2xl">{selectedEvent.title}</DrawerTitle>
              <DrawerDescription>{selectedEvent.city}, {selectedEvent.country} · {selectedEvent.date}</DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 px-4 pb-6">
              <img src={selectedEvent.image} alt="" className="h-36 w-full rounded-2xl object-cover" />
              <p className="text-sm leading-6 text-muted-foreground">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="warm"><Users className="size-4" /> Join</Button>
                <Button variant="outline"><Heart className="size-4" /> Save</Button>
              </div>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-glass-border bg-glass p-2 shadow-glass backdrop-blur-2xl lg:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button key={item.label} variant="nav" size="icon" aria-label={item.label}>
              <Icon className="size-5" />
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

export default GlobeTrotterApp;
