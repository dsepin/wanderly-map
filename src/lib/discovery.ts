import type { EventCategory, TravelEvent } from "./globetrotter-data";

/* ------------------------------------------------------------------ */
/*  Filtre taksonomisi: 6 grup, Airbnb tarzı akordeon + rozet sayaç    */
/* ------------------------------------------------------------------ */

export type FacetGroupId = "experience" | "drinks" | "audience" | "budget" | "tempo" | "time";

export type FacetFilters = {
  experience: string[];
  drinks: string[];
  audience: string[];
  budget: number[];
  freeOnly: boolean;
  tempo: string[];
  time: string[]; // 'simdi' | 'gece' | 'hafta'
};

export const EMPTY_FACETS: FacetFilters = {
  experience: [],
  drinks: [],
  audience: [],
  budget: [],
  freeOnly: false,
  tempo: [],
  time: [],
};

export type FacetChild = { id: string; label: string };
export type FacetParent = { id: string; label: string; children: FacetChild[] };

export type FacetGroupDef = {
  id: FacetGroupId;
  title: string;
  hint: string;
  parents?: FacetParent[];
  singles?: FacetChild[];
  custom?: "budget" | "time";
};

export const FILTER_GROUPS: FacetGroupDef[] = [
  {
    id: "experience",
    title: "Etkinlik & Deneyim Türü",
    hint: "Çoklu seçim",
    parents: [
      {
        id: "gece",
        label: "Gece Hayatı & Eğlence",
        children: [
          { id: "canli-muzik", label: "Canlı Müzik" },
          { id: "dj", label: "DJ" },
          { id: "club", label: "Club" },
          { id: "pub", label: "Pub" },
          { id: "sahil", label: "Sahil Etkinliği" },
        ],
      },
      {
        id: "kultur",
        label: "Kültür & Sanat",
        children: [
          { id: "muze", label: "Müze" },
          { id: "tiyatro", label: "Tiyatro" },
          { id: "sergi", label: "Sergi" },
          { id: "galeri", label: "Galeri" },
        ],
      },
      {
        id: "doga",
        label: "Doğa & Yürüyüş",
        children: [
          { id: "trekking", label: "Trekking" },
          { id: "park", label: "Park" },
          { id: "bisiklet", label: "Bisiklet" },
        ],
      },
      {
        id: "yemek",
        label: "Yemek Tutkunu",
        children: [
          { id: "gastronomi", label: "Gastronomi" },
          { id: "sokak", label: "Sokak Lezzetleri" },
          { id: "restoran", label: "Restoran" },
        ],
      },
      {
        id: "atolye",
        label: "Atölye & Workshop",
        children: [
          { id: "resim", label: "Resim" },
          { id: "seramik", label: "Seramik" },
          { id: "mutfak", label: "Yemek Atölyesi" },
        ],
      },
    ],
  },
  {
    id: "drinks",
    title: "İçecek & Konsept",
    hint: "Çoklu seçim",
    singles: [
      { id: "alkollu", label: "Alkollü" },
      { id: "alkolsuz", label: "Alkolsüz / Mocktail" },
      { id: "kahve", label: "Kahve & Tatlı" },
    ],
  },
  {
    id: "audience",
    title: "Kime Uygun?",
    hint: "Çoklu seçim",
    singles: [
      { id: "romantik", label: "Romantik / Çift" },
      { id: "aile", label: "Aile & Çocuk" },
      { id: "arkadas", label: "Arkadaş Grubu" },
      { id: "solo", label: "Solo / Yalnız" },
      { id: "pet", label: "Pet-Friendly" },
    ],
  },
  { id: "budget", title: "Bütçe & Giriş", hint: "Seviye seç", custom: "budget" },
  {
    id: "tempo",
    title: "Tempo & Sağlık",
    hint: "Çoklu seçim",
    parents: [
      {
        id: "saglik",
        label: "Sağlık & Yaşam",
        children: [
          { id: "yoga", label: "Yoga" },
          { id: "meditasyon", label: "Meditasyon" },
        ],
      },
      {
        id: "spor",
        label: "Spor & Hareket",
        children: [
          { id: "kosu", label: "Koşu" },
          { id: "antrenman", label: "Antrenman" },
        ],
      },
      {
        id: "sakin",
        label: "Sakin & Dinlendirici",
        children: [
          { id: "kitap", label: "Kitap Kulübü" },
          { id: "dinlenme", label: "Dinlenme" },
        ],
      },
    ],
  },
  {
    id: "time",
    title: "Zaman & Mesafe",
    hint: "Ne zaman, ne kadar yakın",
    singles: [
      { id: "simdi", label: "Şu An Açık" },
      { id: "gece", label: "Bu Gece" },
      { id: "hafta", label: "Hafta Sonu" },
    ],
    custom: "time",
  },
];

export const BUDGET_LEVELS = [
  { level: 1, label: "₺ Ekonomik" },
  { level: 2, label: "₺₺ Orta" },
  { level: 3, label: "₺₺₺ Lüks" },
];

/* ------------------------- hazır tarzlar ------------------------- */

export type PresetId = "romantik-aksam" | "aile-haftasonu" | "genc-hareketli";

export const PRESETS: { id: PresetId; label: string; patch: Partial<FacetFilters> }[] = [
  {
    id: "romantik-aksam",
    label: "Romantik Akşam",
    patch: { audience: ["romantik"], drinks: ["alkollu"], budget: [2, 3] },
  },
  {
    id: "aile-haftasonu",
    label: "Ailecek Hafta Sonu",
    patch: { audience: ["aile"], freeOnly: true, experience: ["trekking", "park", "bisiklet"] },
  },
  {
    id: "genc-hareketli",
    label: "Genç & Hareketli",
    patch: {
      experience: ["canli-muzik", "dj", "club", "pub", "sahil"],
      audience: ["arkadas"],
      budget: [1, 2],
    },
  },
];

/* --------------------- etkinlik etiket verisi --------------------- */

export type EventFacets = {
  exp: string[];
  drinks: string[];
  aud: string[];
  tempo: string[];
};

export const EVENT_FACETS: Record<string, EventFacets> = {
  "bali-yoga": {
    exp: [],
    drinks: ["alkolsuz"],
    aud: ["solo", "arkadas"],
    tempo: ["yoga", "meditasyon"],
  },
  "tokyo-food": {
    exp: ["gastronomi", "sokak"],
    drinks: ["alkollu"],
    aud: ["arkadas", "romantik"],
    tempo: [],
  },
  "lisbon-fado": {
    exp: ["sergi"],
    drinks: ["alkollu"],
    aud: ["romantik", "arkadas"],
    tempo: ["dinlenme"],
  },
  "banff-hike": {
    exp: ["trekking", "park"],
    drinks: ["alkolsuz"],
    aud: ["arkadas", "solo"],
    tempo: [],
  },
  "oaxaca-mezcal": {
    exp: ["gastronomi", "sokak"],
    drinks: ["alkollu"],
    aud: ["arkadas"],
    tempo: [],
  },
  "marrakech-supper": {
    exp: ["gastronomi"],
    drinks: ["alkolsuz"],
    aud: ["romantik", "aile"],
    tempo: ["dinlenme"],
  },
  "reykjavik-aurora": {
    exp: ["park"],
    drinks: ["alkolsuz", "kahve"],
    aud: ["romantik", "arkadas"],
    tempo: ["dinlenme"],
  },
  "cape-town-paraglide": {
    exp: [],
    drinks: ["alkolsuz"],
    aud: ["arkadas", "solo"],
    tempo: ["antrenman"],
  },
  "berlin-gallery": {
    exp: ["galeri", "club"],
    drinks: ["alkollu"],
    aud: ["arkadas", "solo"],
    tempo: [],
  },
  "cusco-valley": {
    exp: ["trekking", "park"],
    drinks: ["alkolsuz"],
    aud: ["arkadas", "solo"],
    tempo: ["kosu"],
  },
};

/* O geceye özel müzik tarzları (özellikle gece etkinliklerinde gösterilir) */
export const MUSIC_STYLES: Record<string, string[]> = {
  "berlin-gallery": ["Techno", "Ambient", "House"],
  "tokyo-food": ["City Pop", "Jazz"],
  "oaxaca-mezcal": ["Cumbia", "Mariachi", "Banda"],
  "lisbon-fado": ["Fado", "Portekiz Gitarı"],
  "marrakech-supper": ["Gnawa", "Chaabi"],
};

const CATEGORY_FACETS: Record<EventCategory, EventFacets> = {
  Nightlife: { exp: ["club", "dj"], drinks: [], aud: ["arkadas"], tempo: [] },
  Hiking: { exp: ["trekking"], drinks: [], aud: ["arkadas"], tempo: [] },
  Cultural: { exp: ["sergi"], drinks: [], aud: ["arkadas"], tempo: [] },
  Foodie: { exp: ["gastronomi"], drinks: [], aud: ["arkadas"], tempo: [] },
  Budget: { exp: ["park"], drinks: [], aud: ["arkadas"], tempo: [] },
  Extreme: { exp: ["trekking"], drinks: [], aud: ["arkadas"], tempo: [] },
  Wellness: { exp: [], drinks: [], aud: ["solo"], tempo: ["yoga"] },
};

export function facetsOf(event: TravelEvent): EventFacets {
  return EVENT_FACETS[event.id] ?? CATEGORY_FACETS[event.category];
}

/* ------------------------- gezgin ek bilgisi ------------------------- */

export const HOST_MIN_RATING = 4.3;

export const TRAVELER_EXTRAS: Record<
  string,
  { rating: number; reviews: number; hostOpen: boolean }
> = {
  maya: { rating: 4.8, reviews: 132, hostOpen: true },
  leo: { rating: 4.5, reviews: 89, hostOpen: true },
  amina: { rating: 4.9, reviews: 211, hostOpen: true },
  noah: { rating: 4.1, reviews: 64, hostOpen: false },
  sofia: { rating: 4.7, reviews: 148, hostOpen: true },
};

/* ------------------------------ tarih ------------------------------ */

/** Haversine: iki koordinat arası km */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/** "Sep 25" -> "2026-09-25" (mock veriler 2026 sonbaharı) */
export function eventDateISO(dateLabel: string): string {
  const [mon, day] = dateLabel.split(" ");
  const month = MONTHS[mon ?? ""] ?? 8;
  const d = String(Number(day)).padStart(2, "0");
  const m = String(month + 1).padStart(2, "0");
  return `2026-${m}-${d}`;
}

export function eventWeekday(dateLabel: string): number {
  return new Date(`${eventDateISO(dateLabel)}T12:00:00`).getDay();
}

export function eventHour(timeLabel: string): number {
  return Number(timeLabel.split(":")[0]);
}

export function todayISO(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

export function addDaysISO(iso: string, days: number): string {
  const dt = new Date(`${iso}T12:00:00`);
  dt.setDate(dt.getDate() + days);
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${m}-${d}`;
}

/** 0 = ücretsiz, 1 = ₺ (≤20), 2 = ₺₺ (≤50), 3 = ₺₺₺ */
export function priceLevel(price: number): number {
  if (price <= 0) return 0;
  if (price <= 20) return 1;
  if (price <= 50) return 2;
  return 3;
}

function timeCheck(event: TravelEvent, flag: string): boolean {
  const iso = eventDateISO(event.date);
  if (flag === "simdi") return iso >= todayISO() && iso <= addDaysISO(todayISO(), 2);
  if (flag === "gece") return eventHour(event.time) >= 18;
  if (flag === "hafta") return [0, 6].includes(eventWeekday(event.date));
  return true;
}

/* --------------------------- eşleşme --------------------------- */

/** Pinler için sert filtre: seçili her grup AND ile uygulanır. */
export function matchEventFacets(
  event: TravelEvent,
  f: FacetFilters,
  radiusKm: number,
  liveDistanceKm?: number,
): boolean {
  const distKm = liveDistanceKm ?? event.distanceKm;
  if (distKm > radiusKm) return false;
  const fx = facetsOf(event);
  if (f.experience.length > 0 && !f.experience.some((x) => fx.exp.includes(x))) return false;
  if (f.drinks.length > 0 && !f.drinks.some((x) => fx.drinks.includes(x))) return false;
  if (f.audience.length > 0 && !f.audience.some((x) => fx.aud.includes(x))) return false;
  if (f.tempo.length > 0 && !f.tempo.some((x) => fx.tempo.includes(x))) return false;
  if (f.freeOnly && event.price !== 0) return false;
  if (f.budget.length > 0) {
    const level = priceLevel(event.price);
    if (level === 0) {
      if (!f.freeOnly) return false;
    } else if (!f.budget.includes(level)) {
      return false;
    }
  }
  if (f.time.length > 0 && !f.time.some((t) => timeCheck(event, t))) return false;
  return true;
}

export type MatchScore = { pct: number; matched: number; total: number };

/** Tarz Uyumu Oranı: seçili filtrelerin kaçı mekâna uyuyor? */
export function styleMatchScore(event: TravelEvent, f: FacetFilters): MatchScore {
  const fx = facetsOf(event);
  const checks: boolean[] = [];
  f.experience.forEach((x) => checks.push(fx.exp.includes(x)));
  f.drinks.forEach((x) => checks.push(fx.drinks.includes(x)));
  f.audience.forEach((x) => checks.push(fx.aud.includes(x)));
  f.tempo.forEach((x) => checks.push(fx.tempo.includes(x)));
  if (f.freeOnly) checks.push(event.price === 0);
  f.budget.forEach((b) =>
    checks.push(priceLevel(event.price) === b || (event.price === 0 && f.freeOnly)),
  );
  f.time.forEach((t) => checks.push(timeCheck(event, t)));
  if (checks.length === 0) return { pct: 100, matched: 0, total: 0 };
  const matched = checks.filter(Boolean).length;
  return { pct: Math.round((matched / checks.length) * 100), matched, total: checks.length };
}
