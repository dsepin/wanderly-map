import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useGlobeTrotter } from "@/contexts/globetrotter-context";
import type { TravelEvent } from "@/lib/globetrotter-data";

const tileLayers = {
  "Vintage Travel": {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    className: "map-tiles-vintage",
  },
  "Dark Minimal": {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    className: "map-tiles-dark",
  },
  Satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    className: "map-tiles-satellite",
  },
};

type Cluster = {
  id: string;
  coordinates: [number, number];
  events: TravelEvent[];
};

function makeEventIcon(category: string, selected: boolean) {
  return L.divIcon({
    className: "globetrotter-marker-shell",
    html: `<span class="gt-marker ${selected ? "gt-marker-selected" : ""}" data-category="${category.toLowerCase()}"><span></span></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function makeTravelerIcon(active: boolean) {
  return L.divIcon({
    className: "globetrotter-marker-shell",
    html: `<span class="gt-traveler-marker ${active ? "gt-traveler-active" : ""}"><span></span></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function makeClusterIcon(count: number) {
  return L.divIcon({
    className: "globetrotter-marker-shell",
    html: `<span class="gt-cluster-marker"><strong>${count}</strong></span>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

function clusterEvents(events: TravelEvent[], zoom: number): Cluster[] {
  if (zoom >= 5) {
    return events.map((event) => ({ id: event.id, coordinates: event.coordinates, events: [event] }));
  }

  const bucketSize = zoom < 3 ? 28 : 14;
  const buckets = new Map<string, TravelEvent[]>();

  events.forEach((event) => {
    const latBucket = Math.round(event.coordinates[0] / bucketSize);
    const lngBucket = Math.round(event.coordinates[1] / bucketSize);
    const key = `${latBucket}:${lngBucket}`;
    buckets.set(key, [...(buckets.get(key) ?? []), event]);
  });

  return Array.from(buckets.entries()).map(([id, bucketEvents]) => {
    const center = bucketEvents.reduce<[number, number]>(
      (acc, event) => [acc[0] + event.coordinates[0], acc[1] + event.coordinates[1]],
      [0, 0],
    );
    return {
      id,
      coordinates: [center[0] / bucketEvents.length, center[1] / bucketEvents.length],
      events: bucketEvents,
    };
  });
}

function MapController({ selectedEvent }: { selectedEvent?: TravelEvent }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent) {
      map.flyTo(selectedEvent.coordinates, Math.max(map.getZoom(), 5), { duration: 0.9 });
    }
  }, [map, selectedEvent]);

  return null;
}

function ClusterMarker({
  cluster,
  zoom,
  onSelect,
}: {
  cluster: Cluster;
  zoom: number;
  onSelect: (eventId: string) => void;
}) {
  const map = useMap();

  return (
    <Marker
      position={cluster.coordinates}
      icon={makeClusterIcon(cluster.events.length)}
      eventHandlers={{
        click: () => {
          map.flyTo(cluster.coordinates, Math.min(zoom + 2, 7), { duration: 0.8 });
        },
      }}
    >
      <Popup>
        <div className="w-52 space-y-2 font-sans text-popover-foreground">
          <p className="text-sm font-semibold">{cluster.events.length} trips nearby</p>
          {cluster.events.slice(0, 3).map((event) => (
            <button
              key={event.id}
              className="block w-full rounded-md px-2 py-1 text-left text-xs text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              onClick={() => onSelect(event.id)}
              type="button"
            >
              {event.title}
            </button>
          ))}
        </div>
      </Popup>
    </Marker>
  );
}

function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({
    zoomend(event) {
      onZoom(event.target.getZoom());
    },
  });
  return null;
}

export default function TravelMap() {
  const {
    filteredEvents,
    travelers,
    selectedEventId,
    selectedEvent,
    setSelectedEventId,
    mapStyle,
    radarEnabled,
  } = useGlobeTrotter();
  const [zoom, setZoom] = useState(2.4);
  const layer = tileLayers[mapStyle];
  const clusters = useMemo(() => clusterEvents(filteredEvents, zoom), [filteredEvents, zoom]);

  return (
    <MapContainer
      center={[22, 18]}
      zoom={2.4}
      minZoom={2}
      maxZoom={14}
      scrollWheelZoom
      className="globetrotter-map"
      zoomControl={false}
    >
      <TileLayer key={mapStyle} url={layer.url} attribution={layer.attribution} className={layer.className} />
      <ZoomWatcher onZoom={setZoom} />
      <MapController selectedEvent={selectedEvent} />

      {clusters.map((cluster) => {
        if (cluster.events.length > 1) {
          return <ClusterMarker key={cluster.id} cluster={cluster} zoom={zoom} onSelect={setSelectedEventId} />;
        }

        const event = cluster.events[0];
        if (!event) return null;

        return (
          <Marker
            key={event.id}
            position={event.coordinates}
            icon={makeEventIcon(event.category, event.id === selectedEventId)}
            eventHandlers={{ click: () => setSelectedEventId(event.id) }}
          >
            <Popup>
              <div className="w-64 overflow-hidden rounded-md bg-popover font-sans text-popover-foreground">
                <img src={event.image} alt="" className="h-28 w-full object-cover" />
                <div className="space-y-3 p-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-terracotta">{event.category}</p>
                    <h3 className="mt-1 text-base font-semibold">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {event.city}, {event.country}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="size-3 text-ochre" /> {event.rating}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Users className="size-3" /> {event.attendees}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="warm" className="flex-1">Join</Button>
                    <Button size="sm" variant="outline" className="flex-1">Save</Button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {radarEnabled &&
        travelers
          .filter((traveler) => traveler.openToMeet)
          .map((traveler) => (
            <Marker key={traveler.id} position={traveler.coordinates} icon={makeTravelerIcon(traveler.openToMeet)}>
              <Popup>
                <div className="w-48 space-y-2 font-sans text-popover-foreground">
                  <div className="flex items-center gap-2">
                    <img src={traveler.avatar} alt="" className="size-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{traveler.name}</p>
                      <p className="text-xs text-muted-foreground">Open to meet nearby</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{traveler.bio}</p>
                </div>
              </Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}
