export type EventCategory =
  | "Nightlife"
  | "Hiking"
  | "Cultural"
  | "Foodie"
  | "Budget"
  | "Extreme"
  | "Wellness";

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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    location: "Lisbon, Portugal",
    coordinates: [38.7223, -9.1393],
    countriesVisited: 29,
    badges: ["Gallery Hopper", "Cafe Cartographer"],
    travelStyles: ["Culture", "Luxury", "Slow travel"],
    bio: "Design hotels, small galleries, tiled streets, and long lunches.",
    openToMeet: true,
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
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    hostId: "sofia",
    tags: ["Beach", "Breathwork", "Beginner"],
    description: "Golden-hour flow, coconut breakfast, and a quiet swim before the cafes open.",
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
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    hostId: "maya",
    tags: ["Ramen", "Izakaya", "Late night"],
    description: "A tiny-lanes tasting route through yakitori counters, vending gems, and dessert bars.",
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
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80",
    hostId: "amina",
    tags: ["Rooftop", "Cooking", "Medina"],
    description: "Shop spices with the host, cook tagine together, and dine above the medina lights.",
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
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",
    hostId: "noah",
    tags: ["Inca trail", "Ruins", "Altitude"],
    description: "A gentle acclimatization trek through terraces, ruins, and valley viewpoints.",
  },
];

export const feedItems: FeedItem[] = [
  { id: "feed-1", actor: "Maya", action: "joined", place: "Berlin Warehouse Gallery Night", minutesAgo: 2 },
  { id: "feed-2", actor: "Leo", action: "created", place: "Banff Alpine Sunrise Hike", minutesAgo: 7 },
  { id: "feed-3", actor: "Amina", action: "saved", place: "Marrakech Rooftop Supper Club", minutesAgo: 12 },
  { id: "feed-4", actor: "Noah", action: "opened radar near", place: "Reykjavik", minutesAgo: 18 },
  { id: "feed-5", actor: "Sofia", action: "shared an itinerary for", place: "Lisbon", minutesAgo: 24 },
];
