import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import {
  categories,
  feedItems,
  travelEvents,
  travelers,
  type EventCategory,
  type FeedItem,
  type TravelEvent,
} from "@/lib/globetrotter-data";
import {
  EMPTY_FACETS,
  PRESETS,
  haversineKm,
  matchEventFacets,
  type FacetFilters,
  type FacetGroupId,
  type PresetId,
} from "@/lib/discovery";

type MapStyle = "Vintage Travel" | "Dark Minimal" | "Satellite";
type ViewMode = "list" | "grid";
type ThemeMode = "light" | "dark";

type DraftEvent = Pick<
  TravelEvent,
  "title" | "city" | "country" | "category" | "date" | "time" | "price" | "description"
> & {
  coordinates: [number, number];
  coverPreview?: string | undefined;
};

type GlobeTrotterState = {
  allEvents: TravelEvent[];
  filteredEvents: TravelEvent[];
  travelers: typeof travelers;
  categories: EventCategory[];
  activeCategories: EventCategory[];
  selectedEventId: string;
  selectedEvent: TravelEvent | undefined;
  mapStyle: MapStyle;
  viewMode: ViewMode;
  theme: ThemeMode;
  radiusKm: number;
  radarEnabled: boolean;
  feed: FeedItem[];
  session: Session | null;
  searchQuery: string;
  savedEventIds: string[];
  joinedEventIds: string[];
  hostRequestIds: string[];
  facets: FacetFilters;
  pickMode: boolean;
  mapCenter: [number, number];
  createOpen: boolean;
  createCoordinates: [number, number];
  remindEventIds: string[];
  requestEventIds: string[];
  approvedEventIds: string[];
  chatEventId: string;
  setMapCenter: (center: [number, number]) => void;
  setPickMode: (pickMode: boolean) => void;
  setCreateOpen: (open: boolean) => void;
  setCreateCoordinates: (coords: [number, number]) => void;
  toggleRemind: (eventId: string) => void;
  sendJoinRequest: (eventId: string) => void;
  approveJoinRequest: (eventId: string) => void;
  openChat: (eventId: string) => void;
  closeChat: () => void;
  setSelectedEventId: (eventId: string) => void;
  toggleCategory: (category: EventCategory) => void;
  clearFilters: () => void;
  setMapStyle: (style: MapStyle) => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setRadiusKm: (radius: number) => void;
  setRadarEnabled: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleSave: (eventId: string) => void;
  joinEvent: (eventId: string) => void;
  requestHostStay: (travelerId: string) => void;
  toggleFacet: (group: FacetGroupId, id: string | number) => void;
  toggleFacetParent: (group: FacetGroupId, childIds: string[]) => void;
  setFreeOnly: (value: boolean) => void;
  applyPreset: (preset: PresetId) => void;
  clearFacetFilters: () => void;
  facetCount: (group: FacetGroupId) => number;
  totalFacetCount: number;
  addEvent: (event: DraftEvent) => void;
};

const GlobeTrotterContext = createContext<GlobeTrotterState | undefined>(undefined);

export function GlobeTrotterProvider({ children }: { children: ReactNode }) {
  const [createdEvents, setCreatedEvents] = useState<TravelEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(categories);
  const [mapStyle, setMapStyle] = useState<MapStyle>("Vintage Travel");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [radiusKm, setRadiusKm] = useState(10);
  const [radarEnabled, setRadarEnabled] = useState(true);
  const [feed, setFeed] = useState(feedItems);
  const [session, setSession] = useState<Session | null>(null);
  const [facets, setFacets] = useState<FacetFilters>(EMPTY_FACETS);
  const [hostRequestIds, setHostRequestIds] = useState<string[]>([]);
  const [pickMode, setPickMode] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22, 18]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createCoordinates, setCreateCoordinates] = useState<[number, number]>([41.0082, 28.9784]);
  const [remindEventIds, setRemindEventIds] = useState<string[]>([]);
  const [requestEventIds, setRequestEventIds] = useState<string[]>([]);
  const [approvedEventIds, setApprovedEventIds] = useState<string[]>([]);
  const [chatEventId, setChatEventId] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("globetrotter-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("globetrotter-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Supabase anahtarı yoksa (örn. anahtarsız önizleme) uygulama çökmesin:
    // harita + filtreler mock veriyle çalışmaya devam eder.
    let mounted = true;
    let listener: { subscription: { unsubscribe: () => void } } | undefined;
    try {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (mounted) setSession(data.session);
        })
        .catch(() => {
          /* çevrimdışı mod: misafir olarak devam */
        });

      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (mounted) setSession(nextSession);
      });
      listener = data;
    } catch {
      /* Supabase yapılandırılmamış: misafir modu */
    }

    return () => {
      mounted = false;
      try {
        listener?.subscription.unsubscribe();
      } catch {
        /* yoksay */
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeed((current) => {
        const [first, ...rest] = current;
        if (!first) return current;
        return [...rest, { ...first, id: `${first.id}-${Date.now()}`, minutesAgo: 1 }].map(
          (item, index) => ({
            ...item,
            minutesAgo: index === current.length - 1 ? 1 : item.minutesAgo + 3,
          }),
        );
      });
    }, 9000);

    return () => window.clearInterval(timer);
  }, []);

  const allEvents = useMemo(() => {
    const withJoins = [...createdEvents, ...travelEvents].map((event) =>
      joinedEventIds.includes(event.id)
        ? { ...event, attendees: Math.min(event.attendees + 1, event.maxAttendees) }
        : event,
    );
    return withJoins;
  }, [createdEvents, joinedEventIds]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allEvents
      .filter((event) => {
        const distKm = haversineKm(mapCenter, event.coordinates);
        if (!activeCategories.includes(event.category)) return false;
        if (!matchEventFacets(event, facets, radiusKm, distKm)) return false;
        if (!query) return true;
        const haystack = [
          event.title,
          event.city,
          event.country,
          event.category,
          event.description,
          ...event.tags,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
      .sort(
        (a, b) => haversineKm(mapCenter, a.coordinates) - haversineKm(mapCenter, b.coordinates),
      );
  }, [activeCategories, allEvents, facets, mapCenter, radiusKm, searchQuery]);

  const selectedEvent = useMemo(
    () => allEvents.find((event) => event.id === selectedEventId),
    [allEvents, selectedEventId],
  );

  const toggleCategory = useCallback((category: EventCategory) => {
    setActiveCategories((current) => {
      if (current.includes(category)) {
        const next = current.filter((item) => item !== category);
        return next.length > 0 ? next : current;
      }
      return [...current, category];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveCategories(categories);
    setRadiusKm(10);
    setFacets(EMPTY_FACETS);
    setSearchQuery("");
  }, []);

  const toggleFacet = useCallback((group: FacetGroupId, id: string | number) => {
    setFacets((current) => {
      if (group === "budget" && typeof id === "number") {
        const next = current.budget.includes(id)
          ? current.budget.filter((b) => b !== id)
          : [...current.budget, id];
        return { ...current, budget: next };
      }
      if (typeof id !== "string") return current;
      const list = current[group] as string[];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...current, [group]: next };
    });
  }, []);

  const toggleFacetParent = useCallback((group: FacetGroupId, childIds: string[]) => {
    setFacets((current) => {
      const list = current[group] as string[];
      const allOn = childIds.every((id) => list.includes(id));
      const next = allOn
        ? list.filter((x) => !childIds.includes(x))
        : [...new Set([...list, ...childIds])];
      return { ...current, [group]: next };
    });
  }, []);

  const setFreeOnly = useCallback((value: boolean) => {
    setFacets((current) => ({ ...current, freeOnly: value }));
  }, []);

  const applyPreset = useCallback((preset: PresetId) => {
    const found = PRESETS.find((p) => p.id === preset);
    if (!found) return;
    setFacets((current) => ({ ...current, ...EMPTY_FACETS, ...found.patch }));
  }, []);

  const clearFacetFilters = useCallback(() => {
    setFacets(EMPTY_FACETS);
  }, []);

  const facetCount = useCallback(
    (group: FacetGroupId): number => {
      if (group === "budget") return facets.budget.length + (facets.freeOnly ? 1 : 0);
      return (facets[group] as string[]).length;
    },
    [facets],
  );

  const totalFacetCount = useMemo(
    () =>
      facets.experience.length +
      facets.drinks.length +
      facets.audience.length +
      facets.budget.length +
      (facets.freeOnly ? 1 : 0) +
      facets.tempo.length +
      facets.time.length,
    [facets],
  );

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  }, []);

  const toggleSave = useCallback((eventId: string) => {
    setSavedEventIds((current) =>
      current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId],
    );
  }, []);

  const joinEvent = useCallback(
    (eventId: string) => {
      if (joinedEventIds.includes(eventId)) return;
      setJoinedEventIds((current) => [...current, eventId]);
      const target = allEvents.find((event) => event.id === eventId);
      if (target) {
        setFeed((current) => [
          {
            id: `joined-${eventId}-${Date.now()}`,
            actor: "You",
            action: "joined",
            place: target.title,
            minutesAgo: 1,
          },
          ...current.slice(0, 5),
        ]);
      }
    },
    [allEvents, joinedEventIds],
  );

  const requestHostStay = useCallback(
    (travelerId: string) => {
      if (hostRequestIds.includes(travelerId)) return;
      setHostRequestIds((current) => [...current, travelerId]);
      const host = travelers.find((t) => t.id === travelerId);
      setFeed((current) => [
        {
          id: `host-${travelerId}-${Date.now()}`,
          actor: "You",
          action: "requested a stay with",
          place: host?.name ?? "host",
          minutesAgo: 1,
        },
        ...current.slice(0, 5),
      ]);
    },
    [hostRequestIds],
  );

  const toggleRemind = useCallback((eventId: string) => {
    setRemindEventIds((current) =>
      current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId],
    );
  }, []);

  const sendJoinRequest = useCallback(
    (eventId: string) => {
      if (requestEventIds.includes(eventId)) return;
      setRequestEventIds((current) => [...current, eventId]);
      const target = allEvents.find((event) => event.id === eventId);
      if (target) {
        setFeed((current) => [
          {
            id: `request-${eventId}-${Date.now()}`,
            actor: "You",
            action: "sent a stay request to",
            place: target.title,
            minutesAgo: 1,
          },
          ...current.slice(0, 5),
        ]);
      }
    },
    [allEvents, requestEventIds],
  );

  const approveJoinRequest = useCallback((eventId: string) => {
    setApprovedEventIds((current) => (current.includes(eventId) ? current : [...current, eventId]));
    setChatEventId(eventId);
  }, []);

  const openChat = useCallback((eventId: string) => {
    setChatEventId(eventId);
  }, []);

  const closeChat = useCallback(() => {
    setChatEventId("");
  }, []);

  const addEvent = useCallback((event: DraftEvent) => {
    const newEvent: TravelEvent = {
      ...event,
      id: `custom-${Date.now()}`,
      rating: 4.7,
      attendees: 1,
      maxAttendees: 10,
      distanceKm: 2,
      currency: "USD",
      hostId: "maya",
      tags: ["New", "Community"],
      image:
        event.coverPreview ??
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    };
    setCreatedEvents((current) => [newEvent, ...current]);
    setSelectedEventId(newEvent.id);
    setFeed((current) => [
      {
        id: `created-${newEvent.id}`,
        actor: "You",
        action: "created",
        place: newEvent.title,
        minutesAgo: 1,
      },
      ...current.slice(0, 5),
    ]);
  }, []);

  const value = useMemo<GlobeTrotterState>(
    () => ({
      allEvents,
      filteredEvents,
      travelers,
      categories,
      activeCategories,
      selectedEventId,
      selectedEvent,
      mapStyle,
      viewMode,
      theme,
      radiusKm,
      radarEnabled,
      feed,
      session,
      searchQuery,
      savedEventIds,
      joinedEventIds,
      hostRequestIds,
      facets,
      pickMode,
      mapCenter,
      createOpen,
      createCoordinates,
      remindEventIds,
      requestEventIds,
      approvedEventIds,
      chatEventId,
      setMapCenter,
      setPickMode,
      setCreateOpen,
      setCreateCoordinates,
      toggleRemind,
      sendJoinRequest,
      approveJoinRequest,
      openChat,
      closeChat,
      setSelectedEventId,
      toggleCategory,
      clearFilters,
      setMapStyle,
      setViewMode,
      setTheme,
      setRadiusKm,
      setRadarEnabled,
      setSearchQuery,
      toggleSave,
      joinEvent,
      requestHostStay,
      toggleFacet,
      toggleFacetParent,
      setFreeOnly,
      applyPreset,
      clearFacetFilters,
      facetCount,
      totalFacetCount,
      addEvent,
    }),
    [
      activeCategories,
      allEvents,
      clearFilters,
      feed,
      filteredEvents,
      mapStyle,
      radarEnabled,
      radiusKm,
      selectedEvent,
      selectedEventId,
      session,
      searchQuery,
      savedEventIds,
      joinedEventIds,
      hostRequestIds,
      facets,
      pickMode,
      mapCenter,
      createOpen,
      createCoordinates,
      remindEventIds,
      requestEventIds,
      approvedEventIds,
      chatEventId,
      setMapCenter,
      setPickMode,
      setCreateOpen,
      setCreateCoordinates,
      toggleRemind,
      sendJoinRequest,
      approveJoinRequest,
      openChat,
      closeChat,
      facetCount,
      totalFacetCount,
      setTheme,
      toggleCategory,
      viewMode,
      setSearchQuery,
      toggleSave,
      joinEvent,
      requestHostStay,
      toggleFacet,
      toggleFacetParent,
      setFreeOnly,
      applyPreset,
      clearFacetFilters,
      addEvent,
    ],
  );

  return <GlobeTrotterContext.Provider value={value}>{children}</GlobeTrotterContext.Provider>;
}

export function useGlobeTrotter() {
  const context = useContext(GlobeTrotterContext);
  if (!context) {
    throw new Error("useGlobeTrotter must be used inside GlobeTrotterProvider");
  }
  return context;
}
