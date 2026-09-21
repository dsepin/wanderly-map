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
  maxPrice: number;
  radarEnabled: boolean;
  feed: FeedItem[];
  session: Session | null;
  searchQuery: string;
  savedEventIds: string[];
  joinedEventIds: string[];
  setSelectedEventId: (eventId: string) => void;
  toggleCategory: (category: EventCategory) => void;
  clearFilters: () => void;
  setMapStyle: (style: MapStyle) => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setRadiusKm: (radius: number) => void;
  setMaxPrice: (price: number) => void;
  setRadarEnabled: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleSave: (eventId: string) => void;
  joinEvent: (eventId: string) => void;
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
  const [radiusKm, setRadiusKm] = useState(25);
  const [maxPrice, setMaxPrice] = useState(90);
  const [radarEnabled, setRadarEnabled] = useState(true);
  const [feed, setFeed] = useState(feedItems);
  const [session, setSession] = useState<Session | null>(null);

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
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
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
    return allEvents.filter((event) => {
      const matchesFilters =
        activeCategories.includes(event.category) &&
        event.distanceKm <= radiusKm &&
        event.price <= maxPrice;
      if (!matchesFilters) return false;
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
    });
  }, [activeCategories, allEvents, maxPrice, radiusKm, searchQuery]);

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
    setRadiusKm(25);
    setMaxPrice(90);
    setSearchQuery("");
  }, []);

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
      maxPrice,
      radarEnabled,
      feed,
      session,
      searchQuery,
      savedEventIds,
      joinedEventIds,
      setSelectedEventId,
      toggleCategory,
      clearFilters,
      setMapStyle,
      setViewMode,
      setTheme,
      setRadiusKm,
      setMaxPrice,
      setRadarEnabled,
      setSearchQuery,
      toggleSave,
      joinEvent,
      addEvent,
    }),
    [
      activeCategories,
      allEvents,
      clearFilters,
      feed,
      filteredEvents,
      mapStyle,
      maxPrice,
      radarEnabled,
      radiusKm,
      selectedEvent,
      selectedEventId,
      session,
      searchQuery,
      savedEventIds,
      joinedEventIds,
      setTheme,
      toggleCategory,
      viewMode,
      setSearchQuery,
      toggleSave,
      joinEvent,
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
