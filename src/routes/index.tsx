import { createFileRoute } from "@tanstack/react-router";

import GlobeTrotterApp from "@/components/globetrotter-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlobeTrotter — Social Travel Map" },
      {
        name: "description",
        content:
          "Explore travel events, nearby travelers, live activity, and collaborative itineraries on GlobeTrotter's interactive map.",
      },
      { property: "og:title", content: "GlobeTrotter — Social Travel Map" },
      {
        property: "og:description",
        content:
          "A vibrant social travel platform for discovering events, meeting travelers, and planning shared itineraries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GlobeTrotterApp />;
}
