# Wanderly Map

Act as an expert Full-Stack Software Engineer and Lead UI/UX Designer. Build a comprehensive, multi-user, aesthetic, and interactive web application for travelers called "GlobeTrotter" (or a temporary placeholder name).

### 1. CORE CONCEPT & AESTHETIC THEME

- **Concept:** A social travel platform combining interactive map exploration and real-time event/activity discovery.

- **Visual Style & Aesthetics:** Modern, clean, immersive, and vibrant. Use a dark/light mode toggle with a default "Editorial Travel" aesthetic (soft cream/sand backgrounds in light mode, deep slate/obsidian in dark mode, accented with warm terracotta and sage green). Smooth animations (Framer Motion style), rounded cards, glassmorphism overlays on maps, and high-quality iconography (Lucide Icons).

### 2. TECH STACK & ARCHITECTURE

- **Frontend:** React, Tailwind CSS, TypeScript, Shadcn/ui components.

- **Mapping Engine:** Mapbox GL JS or Leaflet.js with custom styled vector tiles (matching the light/dark travel aesthetic).

- **Backend & Auth:** Supabase (User Authentication, PostgreSQL database, Realtime subscriptions, and Storage for images).

### 3. KEY FEATURE MODULES

#### A. Interactive Map View (Core Canvas)

- Dynamic full-screen map with customizable style filters (e.g., Satellites, Vintage Travel, Dark Minimal).

- **Cluster Markers:** Group nearby activities/events and travelers dynamically. Clicking a cluster zooms in.

- **Custom Markers:** Distinct visual markers for "Events", "Places/Spots", and "Active Travelers nearby".

- **Interactive Popup Card:** Hovering/clicking a marker slides open a preview card with image, title, user rating, date/time, and a "Join" or "Save" button.

#### B. Event & Activity Hub

- **List & Grid View:** Toggleable alongside or over the map.

- **Filters:** Category (Nightlife, Hiking, Cultural, Foodie, Budget, Extreme), Date Range, Distance/Radius, and Price.

- **Event Creation Modal:** Multi-step wizard allowing users to drop a pin on the map, set date/time, max attendees, category, description, and upload cover photos.

#### C. Multi-User & Social Features

- **User Profiles:** Travel stats (countries visited, badges), user bio, travel style tags, and created/joined events.

- **Real-Time Activity Feed:** Live notification feed showing nearby newly created events or joined travelers.

- **Group/Event Chat:** A real-time chat interface inside each event page for confirmed attendees to coordinate.

- **Traveler Radar (Opt-in):** A toggle to show "I am currently here and open to meet" on the map with a temporary radius.

#### D. Itinerary Builder (Trip Planner)

- Drag-and-drop timeline view to organize saved spots and events into daily itineraries.

- Shared/Collaborative Itinerary link for friends.

### 4. UI/UX LAYOUT STRUCTURE

- **Navigation:** Floating frosted-glass navigation bar (Search bar with auto-complete location search, Feed, Map, Events, Itinerary, Profile).

- **Split Screen Mode:** Desktop view should support a split layout: 60% Interactive Map on the right, 40% Scrollable Content/Filters on the left.

- **Mobile Responsive:** Bottom bar navigation with full-bleed map and bottom sheets (drawer components) for details.

### 5. INITIAL DATA & STEP-BY-STEP BUILD

- Please set up mock data for 10 diverse travel events (e.g., "Sunrise Yoga in Bali", "Tokyo Night Food Tour") and 5 active user profiles with rich images (Unsplash travel photography links) so the map is instantly vibrant and interactive.

- Ensure state management (React Context or Zustand) handles active filters, selected map coordinates, and user sessions seamlessly.

Start by building the main App layout, integrating the interactive map with mock markers, the sidebar event feed, and the top navigation bar with the aesthetic theme applied.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6da825a8-e8b3-44c9-b28d-61c0f5346e2c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
