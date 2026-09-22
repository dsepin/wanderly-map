export type EventCategory =
  "Nightlife" | "Hiking" | "Cultural" | "Foodie" | "Budget" | "Extreme" | "Wellness";

export type TravelEvent = {
  id: string;
  title: string;
  city: string;
  country: string;
  category: EventCategory;
  date: string;
  time: string;
  price: number;
  currency: string;
  rating: number;
  attendees: number;
  maxAttendees: number;
  distanceKm: number;
  coordinates: [number, number];
  image: string;
  hostId: string;
  tags: string[];
  description: string;
  venue?: VenueInfo;
};

export type VenueInfo = {
  name: string;
  occupancy: { current: number; capacity: number };
  tables: { id: string; label: string; seats: number; occupied: boolean }[];
  menu: { name: string; price: string; tag?: string }[];
  reviews: { author: string; rating: number; text: string }[];
};

export type TravelerProfile = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  coordinates: [number, number];
  countriesVisited: number;
  badges: string[];
  travelStyles: string[];
  bio: string;
  openToMeet: boolean;
};

export type FeedItem = {
  id: string;
  actor: string;
  action: string;
  place: string;
  minutesAgo: number;
};

export type VenueStory = {
  id: string;
  eventId: string;
  image: string;
  caption: string;
  authorId: string;
  minutesAgo: number;
  views: number;
};

export const categories: EventCategory[] = [
  "Nightlife",
  "Hiking",
  "Cultural",
  "Foodie",
  "Budget",
  "Extreme",
  "Wellness",
];

export const travelers: TravelerProfile[] = [
  {
    id: "maya",
    name: "Maya Chen",
    handle: "maya.moves",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    location: "Tokyo, Japan",
    coordinates: [35.6762, 139.6503],
    countriesVisited: 34,
    badges: ["Food Scout", "Rail Pro", "Night Owl"],
    travelStyles: ["Foodie", "Digital nomad", "Culture"],
    bio: "Slow mornings, late markets, and tiny neighborhood counters.",
    openToMeet: true,
  },
  {
    id: "leo",
    name: "Leo Alvarez",
    handle: "leo.alpine",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    location: "Banff, Canada",
    coordinates: [51.1784, -115.5708],
    countriesVisited: 22,
    badges: ["Trail Lead", "Summit Club"],
    travelStyles: ["Adventure", "Budget", "Hiking"],
    bio: "Mountain routes, shared thermos stops, and leave-no-trace planning.",
    openToMeet: true,
  },
  {
    id: "amina",
    name: "Amina Benali",
    handle: "amina.routes",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    location: "Marrakech, Morocco",
    coordinates: [31.6295, -7.9811],
    countriesVisited: 41,
    badges: ["Story Keeper", "Bazaar Guide"],
    travelStyles: ["Culture", "Foodie", "Slow travel"],
    bio: "Architecture, rooftop kitchens, and conversations over mint tea.",
    openToMeet: false,
  },
  {
    id: "noah",
    name: "Noah Reed",
    handle: "noah.nowhere",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    location: "Reykjavik, Iceland",
    coordinates: [64.1466, -21.9426],
    countriesVisited: 18,
    badges: ["Aurora Chaser", "Roadtrip Captain"],
    travelStyles: ["Adventure", "Budget", "Photography"],
    bio: "Chasing weather windows and the best roadside hot dogs.",
    openToMeet: true,
  },
  {
    id: "sofia",
    name: "Sofia Marino",
    handle: "sofia.sundays",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    location: "Lisbon, Portugal",
    coordinates: [38.7223, -9.1393],
    countriesVisited: 29,
    badges: ["Gallery Hopper", "Cafe Cartographer"],
    travelStyles: ["Culture", "Luxury", "Slow travel"],
    bio: "Design hotels, small galleries, tiled streets, and long lunches.",
    openToMeet: true,
  },
];

/** Mekânlardan gelen anlık story'ler (üst şerit + tam ekran görüntüleyici) */
export const venueStories: VenueStory[] = [
  {
    id: "s1",
    eventId: "ist-taksim-night",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
    caption: "Ritm İstanbul'da gece şimdiden ısındı 🔥",
    authorId: "maya",
    minutesAgo: 18,
    views: 124,
  },
  {
    id: "s2",
    eventId: "ist-karakoy-cafe",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    caption: "V60 demlendi, ilk fincan hazır ☕",
    authorId: "sofia",
    minutesAgo: 42,
    views: 86,
  },
  {
    id: "s3",
    eventId: "ist-bosphorus-sail",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    caption: "Boğaz'da gün batımı büyüsü 🌅",
    authorId: "amina",
    minutesAgo: 65,
    views: 211,
  },
  {
    id: "s4",
    eventId: "tokyo-food",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
    caption: "Yakitori tezgâhı bu akşam dolu 🍢",
    authorId: "maya",
    minutesAgo: 96,
    views: 174,
  },
  {
    id: "s5",
    eventId: "ist-modacik-yoga",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    caption: "Sahilde sabah yogası — 8 kişi katıldı 🧘",
    authorId: "leo",
    minutesAgo: 130,
    views: 58,
  },
  {
    id: "s6",
    eventId: "berlin-gallery",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
    caption: "Yeni serinin açılış günü 🎨",
    authorId: "leo",
    minutesAgo: 180,
    views: 93,
  },
];

export const travelEvents: TravelEvent[] = [
  {
    id: "bali-yoga",
    title: "Sunrise Yoga in Bali",
    city: "Canggu",
    country: "Indonesia",
    category: "Wellness",
    date: "Sep 25",
    time: "06:10",
    price: 12,
    currency: "USD",
    rating: 4.9,
    attendees: 18,
    maxAttendees: 24,
    distanceKm: 1.6,
    coordinates: [-8.65, 115.138],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    hostId: "sofia",
    tags: ["Beach", "Breathwork", "Beginner"],
    description: "Golden-hour flow, coconut breakfast, and a quiet swim before the cafes open.",
    venue: {
      name: "The Loft",
      occupancy: { current: 14, capacity: 40 },
      tables: [
        { id: "m1", label: "A1", seats: 2, occupied: true },
        { id: "m2", label: "A2", seats: 2, occupied: false },
        { id: "m3", label: "B1", seats: 4, occupied: true },
        { id: "m4", label: "B2", seats: 4, occupied: true },
        { id: "m5", label: "C1", seats: 6, occupied: false },
        { id: "m6", label: "C2", seats: 6, occupied: false },
      ],
      menu: [
        { name: "Matcha Smoothie", price: "$6", tag: "Vejetaryen" },
        { name: "Avocado Toast", price: "$12", tag: "Kahvaltı" },
        { name: "Coconut Pancakes", price: "$9", tag: "Tatlı" },
      ],
      reviews: [
        { author: "Kira", rating: 5, text: "Gün doğumu muhteşemdi, atmosfer çok sakin." },
        { author: "Jonas", rating: 4, text: "Kahvaltı harikaydı, yoga saldırgan değildi." },
      ],
    },
  },
  {
    id: "tokyo-food",
    title: "Tokyo Night Food Tour",
    city: "Tokyo",
    country: "Japan",
    category: "Foodie",
    date: "Sep 26",
    time: "20:30",
    price: 42,
    currency: "USD",
    rating: 4.8,
    attendees: 9,
    maxAttendees: 12,
    distanceKm: 3.2,
    coordinates: [35.6938, 139.7034],
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    hostId: "maya",
    tags: ["Ramen", "Izakaya", "Late night"],
    description:
      "A tiny-lanes tasting route through yakitori counters, vending gems, and dessert bars.",
  },
  {
    id: "lisbon-fado",
    title: "Lisbon Fado & Tiles Walk",
    city: "Lisbon",
    country: "Portugal",
    category: "Cultural",
    date: "Sep 27",
    time: "17:45",
    price: 18,
    currency: "EUR",
    rating: 4.7,
    attendees: 11,
    maxAttendees: 16,
    distanceKm: 2.1,
    coordinates: [38.7139, -9.1394],
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
    hostId: "sofia",
    tags: ["Music", "Architecture", "Local guide"],
    description: "Follow tiled alleys into Alfama, then settle into a candlelit fado house.",
  },
  {
    id: "banff-hike",
    title: "Banff Alpine Sunrise Hike",
    city: "Banff",
    country: "Canada",
    category: "Hiking",
    date: "Sep 28",
    time: "05:20",
    price: 8,
    currency: "CAD",
    rating: 4.9,
    attendees: 6,
    maxAttendees: 10,
    distanceKm: 8.5,
    coordinates: [51.4968, -115.9281],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    hostId: "leo",
    tags: ["Trail", "Lake", "Photography"],
    description: "A crisp alpine climb timed for first light over turquoise water.",
  },
  {
    id: "oaxaca-mezcal",
    title: "Oaxaca Mezcal Market Crawl",
    city: "Oaxaca",
    country: "Mexico",
    category: "Foodie",
    date: "Sep 28",
    time: "18:00",
    price: 28,
    currency: "USD",
    rating: 4.8,
    attendees: 14,
    maxAttendees: 18,
    distanceKm: 4.4,
    coordinates: [17.0732, -96.7266],
    image:
      "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=80",
    hostId: "amina",
    tags: ["Market", "Mezcal", "Street food"],
    description: "Taste smoky pours, tlayudas, and handmade chocolate around the evening market.",
  },
  {
    id: "marrakech-supper",
    title: "Marrakech Rooftop Supper Club",
    city: "Marrakech",
    country: "Morocco",
    category: "Cultural",
    date: "Sep 29",
    time: "19:30",
    price: 36,
    currency: "USD",
    rating: 4.9,
    attendees: 10,
    maxAttendees: 14,
    distanceKm: 2.9,
    coordinates: [31.6258, -7.9891],
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80",
    hostId: "amina",
    tags: ["Rooftop", "Cooking", "Medina"],
    description:
      "Shop spices with the host, cook tagine together, and dine above the medina lights.",
  },
  {
    id: "reykjavik-aurora",
    title: "Reykjavik Northern Lights Chase",
    city: "Reykjavik",
    country: "Iceland",
    category: "Budget",
    date: "Sep 30",
    time: "21:15",
    price: 22,
    currency: "USD",
    rating: 4.6,
    attendees: 7,
    maxAttendees: 9,
    distanceKm: 12,
    coordinates: [64.1466, -21.9426],
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    hostId: "noah",
    tags: ["Aurora", "Road trip", "Hot cocoa"],
    description: "A flexible-budget aurora hunt with live cloud checks and warm stops.",
  },
  {
    id: "cape-town-paraglide",
    title: "Cape Town Coastal Paraglide",
    city: "Cape Town",
    country: "South Africa",
    category: "Extreme",
    date: "Oct 01",
    time: "14:00",
    price: 88,
    currency: "USD",
    rating: 4.9,
    attendees: 5,
    maxAttendees: 8,
    distanceKm: 6.6,
    coordinates: [-33.918, 18.389],
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80",
    hostId: "leo",
    tags: ["Adrenaline", "Ocean", "Views"],
    description: "Tandem glide from Signal Hill with a soft landing near the promenade.",
  },
  {
    id: "berlin-gallery",
    title: "Berlin Warehouse Gallery Night",
    city: "Berlin",
    country: "Germany",
    category: "Nightlife",
    date: "Oct 02",
    time: "22:00",
    price: 16,
    currency: "EUR",
    rating: 4.5,
    attendees: 21,
    maxAttendees: 30,
    distanceKm: 5.1,
    coordinates: [52.5006, 13.4529],
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=80",
    hostId: "maya",
    tags: ["Gallery", "DJs", "After dark"],
    description: "Pop-up installations, ambient sets, and a late-night walk through Kreuzberg.",
  },
  {
    id: "cusco-valley",
    title: "Cusco Sacred Valley Day Trek",
    city: "Cusco",
    country: "Peru",
    category: "Hiking",
    date: "Oct 03",
    time: "07:00",
    price: 31,
    currency: "USD",
    rating: 4.8,
    attendees: 12,
    maxAttendees: 16,
    distanceKm: 9.8,
    coordinates: [-13.5319, -71.9675],
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",
    hostId: "noah",
    tags: ["Inca trail", "Ruins", "Altitude"],
    description: "A gentle acclimatization trek through terraces, ruins, and valley viewpoints.",
  },
  {
    id: "ist-bosphorus-sail",
    title: "Boğaz Gün Batımı Tekne Turu",
    city: "İstanbul",
    country: "Türkiye",
    category: "Budget",
    date: "Oct 04",
    time: "17:30",
    price: 8,
    currency: "TRY",
    rating: 4.8,
    attendees: 9,
    maxAttendees: 15,
    distanceKm: 1.2,
    coordinates: [41.0422, 29.0073],
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
    hostId: "amina",
    tags: ["Bosphorus", "Sunset", "Ferry"],
    description: "Ucuz bir halk vapuru yolculuğu; Boğaz köprüleri altında çayla gün batımı.",
  },
  {
    id: "ist-karakoy-cafe",
    title: "Karaköy Kahve & Sanat Sabahı",
    city: "İstanbul",
    country: "Türkiye",
    category: "Cultural",
    date: "Oct 05",
    time: "10:00",
    price: 14,
    currency: "TRY",
    rating: 4.7,
    attendees: 6,
    maxAttendees: 10,
    distanceKm: 2.4,
    coordinates: [41.0237, 28.9766],
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    hostId: "sofia",
    tags: ["Coffee", "Gallery", "Walk"],
    description:
      "Galata'dan Karaköy'e yürüyüş: bağımsız galeriler ve üçüncü dalga kahve durakları.",
    venue: {
      name: "Draft Coffee Lab",
      occupancy: { current: 22, capacity: 30 },
      tables: [
        { id: "c1", label: "Pencere 1", seats: 2, occupied: true },
        { id: "c2", label: "Pencere 2", seats: 2, occupied: true },
        { id: "c3", label: "Orta 1", seats: 4, occupied: false },
        { id: "c4", label: "Orta 2", seats: 4, occupied: true },
        { id: "c5", label: "Tezgah", seats: 3, occupied: false },
      ],
      menu: [
        { name: "V60 Kenya", price: "₺120", tag: "Filtre" },
        { name: "Flat White", price: "₺95", tag: "Espresso" },
        { name: "Pistachio Croissant", price: "₺80", tag: "Tatlı" },
        { name: "Matcha Latte", price: "₺110", tag: "Alkolsüz" },
      ],
      reviews: [
        { author: "Selin", rating: 5, text: "Karaköy'ün en iyi V60'ı burada." },
        { author: "Cem", rating: 4, text: "Atmosfer iyi, hafta sonu kalabalık oluyor." },
      ],
    },
  },
  {
    id: "ist-taksim-night",
    title: "Taksim Gece Hayatı Turu",
    city: "İstanbul",
    country: "Türkiye",
    category: "Nightlife",
    date: "Oct 05",
    time: "22:00",
    price: 22,
    currency: "TRY",
    rating: 4.6,
    attendees: 11,
    maxAttendees: 14,
    distanceKm: 3.7,
    coordinates: [41.0369, 28.9855],
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    hostId: "maya",
    tags: ["Bar hop", "DJs", "Live music"],
    description: "Cihangir'e saklı meyhaneler, canlı müzik ve indie DJ setleriyle gece turu.",
    venue: {
      name: "Ritm İstanbul",
      occupancy: { current: 68, capacity: 120 },
      tables: [
        { id: "n1", label: "Bar 1", seats: 4, occupied: true },
        { id: "n2", label: "Bar 2", seats: 4, occupied: true },
        { id: "n3", label: "Sahne Önü", seats: 8, occupied: true },
        { id: "n4", label: "Sahne Önü 2", seats: 8, occupied: false },
        { id: "n5", label: "Loft 1", seats: 6, occupied: true },
        { id: "n6", label: "Loft 2", seats: 6, occupied: false },
        { id: "n7", label: "Köşe 1", seats: 2, occupied: true },
        { id: "n8", label: "Köşe 2", seats: 2, occupied: false },
      ],
      menu: [
        { name: "Rakı + Meze Tabak", price: "₺320", tag: "Klasik" },
        { name: "Craft Bira Seti", price: "₺240", tag: "Yerli" },
        { name: "Imam Bayıldı", price: "₺150", tag: "Vegan" },
      ],
      reviews: [
        { author: "Deniz", rating: 5, text: "DJ seti harikaydı, yer bulmak için erken gidin." },
        { author: "Elif", rating: 4, text: "Müzik ortamı süper, fiyatlar biraz yüksek." },
        { author: "Mert", rating: 5, text: "Cihangir'in en iyi gece mekanlarından." },
      ],
    },
  },
  {
    id: "ist-modacik-yoga",
    title: "Moda Sahili Güneş Doğumu Yoga",
    city: "İstanbul",
    country: "Türkiye",
    category: "Wellness",
    date: "Oct 06",
    time: "06:30",
    price: 0,
    currency: "TRY",
    rating: 4.9,
    attendees: 8,
    maxAttendees: 12,
    distanceKm: 4.9,
    coordinates: [40.9822, 29.0258],
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
    hostId: "leo",
    tags: ["Beach", "Free", "Sunrise"],
    description: "Ücretsiz sahil yogası; sonrasında simit ve deniz molası. Yeni başlayanlara açık.",
  },
  {
    id: "ist-egypt-bazaar",
    title: "Mısır Çarşısı Baharat & Tatlı Buluşması",
    city: "İstanbul",
    country: "Türkiye",
    category: "Foodie",
    date: "Oct 06",
    time: "13:00",
    price: 10,
    currency: "TRY",
    rating: 4.7,
    attendees: 7,
    maxAttendees: 12,
    distanceKm: 2.8,
    coordinates: [41.0155, 28.9708],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    hostId: "amina",
    tags: ["Bazaar", "Spices", "Baklava"],
    description:
      "Baharat tezgahları, lokum ve taze baklava tatma; Yeni Camii avlusunda müzik molası.",
  },
];

export const feedItems: FeedItem[] = [
  {
    id: "feed-1",
    actor: "Maya",
    action: "joined",
    place: "Berlin Warehouse Gallery Night",
    minutesAgo: 2,
  },
  {
    id: "feed-2",
    actor: "Leo",
    action: "created",
    place: "Banff Alpine Sunrise Hike",
    minutesAgo: 7,
  },
  {
    id: "feed-3",
    actor: "Amina",
    action: "saved",
    place: "Marrakech Rooftop Supper Club",
    minutesAgo: 12,
  },
  { id: "feed-4", actor: "Noah", action: "opened radar near", place: "Reykjavik", minutesAgo: 18 },
  {
    id: "feed-5",
    actor: "Sofia",
    action: "shared an itinerary for",
    place: "Lisbon",
    minutesAgo: 24,
  },
];
