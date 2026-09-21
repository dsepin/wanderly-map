import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobeTrotter } from "@/contexts/globetrotter-context";
import { HOST_MIN_RATING, MUSIC_STYLES, TRAVELER_EXTRAS, styleMatchScore } from "@/lib/discovery";
import type { TravelEvent, TravelerProfile } from "@/lib/globetrotter-data";

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

function makeEventIcon(
  image: string,
  title: string,
  avatarUrl: string,
  hostName: string,
  category: string,
  selected: boolean,
) {
  return L.divIcon({
    className: "globetrotter-marker-shell",
    html:
      `<span class="gt-photo-pin ${selected ? "gt-photo-selected" : ""}" data-category="${category.toLowerCase()}">` +
      `<img class="gt-photo-img" src="${image}" alt="${title.replace(/"/g, "")}" />` +
      `<span class="gt-avatar-badge"><img src="${avatarUrl}" alt="${hostName.replace(/"/g, "")}" /></span>` +
      `</span>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    popupAnchor: [0, -26],
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

function makePickIcon() {
  return L.divIcon({
    className: "globetrotter-marker-shell",
    html: `<span class="gt-pick-pin"><span></span></span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
}

function clusterEvents(events: TravelEvent[], zoom: number): Cluster[] {
  if (zoom >= 5) {
    return events.map((event) => ({
      id: event.id,
      coordinates: event.coordinates,
      events: [event],
    }));
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

function MapController({ selectedEvent }: { selectedEvent: TravelEvent | undefined }) {
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

function ViewWatcher({ onView }: { onView: (zoom: number, lat: number, lng: number) => void }) {
  useMapEvents({
    zoomend(event) {
      const c = event.target.getCenter();
      onView(event.target.getZoom(), c.lat, c.lng);
    },
    moveend(event) {
      const c = event.target.getCenter();
      onView(event.target.getZoom(), c.lat, c.lng);
    },
  });
  return null;
}

/** "Haritaya Tıkla" modu: tıklanan nokta pin olur ve etkinlik sihirbazı açılır */
function ClickToCreate({
  active,
  onClick,
}: {
  active: boolean;
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      if (!active) return;
      onClick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function PickPin({ position }: { position: [number, number] }) {
  return (
    <Marker position={position} icon={makePickIcon()}>
      <Popup>
        <p className="font-sans text-sm font-semibold text-popover-foreground">
          Yeni etkinlik burada oluşturulacak
        </p>
      </Popup>
    </Marker>
  );
}

function EventPopupContent({
  event,
  hostAvatar,
  hostName,
  onProfile,
}: {
  event: TravelEvent;
  hostAvatar: string;
  hostName: string;
  onProfile: (hostId: string) => void;
}) {
  const { facets, totalFacetCount, joinEvent, joinedEventIds, savedEventIds, toggleSave } =
    useGlobeTrotter();
  const isJoined = joinedEventIds.includes(event.id);
  const isSaved = savedEventIds.includes(event.id);
  const music = MUSIC_STYLES[event.id];
  const score = styleMatchScore(event, facets);
  const hostRating = TRAVELER_EXTRAS[event.hostId]?.rating;

  return (
    <div className="w-64 overflow-hidden rounded-md bg-popover font-sans text-popover-foreground">
      <img src={event.image} alt={event.title} className="h-28 w-full object-cover" />
      <div className="space-y-3 p-3">
        <button
          type="button"
          onClick={() => onProfile(event.hostId)}
          className="flex w-full items-center gap-2 rounded-lg p-1 text-left transition hover:bg-accent"
        >
          <img src={hostAvatar} alt={hostName} className="size-8 rounded-full object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">{hostName}</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="size-3 text-ochre" /> {hostRating?.toFixed(2) ?? event.rating} ·
              Profili Gör
            </span>
          </span>
        </button>
        <div>
          <p className="text-xs font-medium uppercase text-terracotta">{event.category}</p>
          <h3 className="mt-1 text-base font-semibold">{event.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {event.city}, {event.country}
          </p>
        </div>
        {totalFacetCount > 0 ? (
          <p className="text-xs font-bold text-sage">Tarz Uyumu %{score.pct}</p>
        ) : null}
        {music ? (
          <p className="text-[11px] text-muted-foreground">Bu gece: {music.join(" • ")}</p>
        ) : null}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3 text-ochre" /> {event.rating}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" /> {event.date}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {event.attendees}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="warm"
            className="flex-1"
            disabled={isJoined}
            onClick={() => joinEvent(event.id)}
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => toggleSave(event.id)}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileDialog({
  travelerId,
  onClose,
}: {
  travelerId: string | null;
  onClose: () => void;
}) {
  const { travelers, allEvents, hostRequestIds, requestHostStay, setSelectedEventId } =
    useGlobeTrotter();
  const traveler = travelers.find((t) => t.id === travelerId);
  const extras = traveler ? TRAVELER_EXTRAS[traveler.id] : undefined;
  const eligible = !!extras && extras.hostOpen && extras.rating >= HOST_MIN_RATING;
  const requested = traveler ? hostRequestIds.includes(traveler.id) : false;
  const hostedEvents = traveler ? allEvents.filter((e) => e.hostId === traveler.id) : [];
  const firstHosted = hostedEvents[0];

  return (
    <Dialog open={!!traveler} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-md">
        {traveler ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <img
                  src={traveler.avatar}
                  alt={traveler.name}
                  className="size-14 rounded-full object-cover"
                />
                <div>
                  <DialogTitle className="font-display text-2xl">{traveler.name}</DialogTitle>
                  <DialogDescription>
                    @{traveler.handle} · {traveler.location}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1 font-bold text-sage">
                  <Star className="size-3 text-ochre" /> {extras?.rating.toFixed(2)} (
                  {extras?.reviews} yorum)
                </span>
                <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
                  {traveler.countriesVisited} ülke
                </span>
                {eligible ? (
                  <span className="rounded-full bg-terracotta/15 px-3 py-1 font-bold text-terracotta">
                    Gönüllü ev sahibi
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{traveler.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {[...traveler.badges, ...traveler.travelStyles].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {eligible ? (
                <Button
                  variant="warm"
                  disabled={requested}
                  onClick={() => requestHostStay(traveler.id)}
                >
                  <Users className="size-4" />
                  {requested ? "Konaklama isteği gönderildi" : "Konaklama İsteği Gönder"}
                </Button>
              ) : (
                <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  Evinde konaklama isteği yalnızca {HOST_MIN_RATING.toFixed(2)}+ puanlı gönüllü ev
                  sahiplerine gönderilebilir.
                </p>
              )}
              {firstHosted ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedEventId(firstHosted.id);
                    onClose();
                  }}
                >
                  <MapPin className="size-4" />
                  {hostedEvents.length} etkinliğini gör
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
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
    pickMode,
    setPickMode,
    createOpen,
    setCreateOpen,
    createCoordinates,
    setCreateCoordinates,
    setMapCenter,
  } = useGlobeTrotter();
  const [zoom, setZoom] = useState(2.4);
  const [profileId, setProfileId] = useState<string | null>(null);
  const layer = tileLayers[mapStyle];
  const clusters = useMemo(() => clusterEvents(filteredEvents, zoom), [filteredEvents, zoom]);
  const hostOf = (hostId: string): TravelerProfile => {
    const found = travelers.find((t) => t.id === hostId);
    if (found) return found;
    const first = travelers[0];
    if (!first) throw new Error("Gezgin listesi boş");
    return first;
  };

  return (
    <>
      <MapContainer
        center={[22, 18]}
        zoom={2.4}
        minZoom={2}
        maxZoom={14}
        scrollWheelZoom
        className="globetrotter-map"
        zoomControl={false}
      >
        <TileLayer
          key={mapStyle}
          url={layer.url}
          attribution={layer.attribution}
          className={layer.className}
        />
        <ViewWatcher
          onView={(nextZoom, lat, lng) => {
            setZoom(nextZoom);
            setMapCenter([lat, lng]);
          }}
        />
        <ClickToCreate
          active={pickMode && !createOpen}
          onClick={(lat, lng) => {
            setCreateCoordinates([lat, lng]);
            setPickMode(false);
            setCreateOpen(true);
          }}
        />
        <MapController selectedEvent={selectedEvent} />

        {pickMode && !createOpen ? <PickPin position={createCoordinates} /> : null}

        {clusters.map((cluster) => {
          if (cluster.events.length > 1) {
            return (
              <ClusterMarker
                key={cluster.id}
                cluster={cluster}
                zoom={zoom}
                onSelect={setSelectedEventId}
              />
            );
          }

          const event = cluster.events[0];
          if (!event) return null;
          const host = hostOf(event.hostId);

          return (
            <Marker
              key={event.id}
              position={event.coordinates}
              icon={makeEventIcon(
                event.image,
                event.title,
                host.avatar,
                host.name,
                event.category,
                event.id === selectedEventId,
              )}
              eventHandlers={{ click: () => setSelectedEventId(event.id) }}
            >
              <Popup>
                <EventPopupContent
                  event={event}
                  hostAvatar={host.avatar}
                  hostName={host.name}
                  onProfile={setProfileId}
                />
              </Popup>
            </Marker>
          );
        })}

        {radarEnabled &&
          travelers
            .filter((traveler) => traveler.openToMeet)
            .map((traveler) => (
              <Marker
                key={traveler.id}
                position={traveler.coordinates}
                icon={makeTravelerIcon(traveler.openToMeet)}
              >
                <Popup>
                  <div className="w-48 space-y-2 font-sans text-popover-foreground">
                    <div className="flex items-center gap-2">
                      <img
                        src={traveler.avatar}
                        alt={traveler.name}
                        className="size-10 rounded-full object-cover"
                      />
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
      <ProfileDialog travelerId={profileId} onClose={() => setProfileId(null)} />
    </>
  );
}
