// Mock Location Data
import type { Location, MapMarker, MapRoute } from "../types/maps.types";
import { CITY_COORDINATES, MARKER_ICONS } from "../config/maps.config";

export const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Golden Gate Park",
    description: "Large urban park with gardens, museums, and trails",
    latitude: 37.7694,
    longitude: -122.4862,
    category: "park",
    icon: MARKER_ICONS.park,
    metadata: {
      address: "San Francisco, CA 94122",
      rating: 4.7,
    },
  },
  {
    id: "loc-2",
    name: "Ferry Building Marketplace",
    description: "Historic waterfront marketplace with local vendors",
    latitude: 37.7955,
    longitude: -122.3937,
    category: "shop",
    icon: MARKER_ICONS.shop,
    metadata: {
      address: "1 Ferry Building, San Francisco, CA 94111",
      rating: 4.6,
    },
  },
  {
    id: "loc-3",
    name: "Alcatraz Island",
    description: "Historic former federal prison on an island",
    latitude: 37.8267,
    longitude: -122.4230,
    category: "attraction",
    icon: MARKER_ICONS.star,
    metadata: {
      address: "Alcatraz Island, San Francisco, CA",
      rating: 4.8,
    },
  },
  {
    id: "loc-4",
    name: "Fisherman's Wharf",
    description: "Popular tourist destination with seafood restaurants",
    latitude: 37.8080,
    longitude: -122.4177,
    category: "restaurant",
    icon: MARKER_ICONS.restaurant,
    metadata: {
      address: "Fisherman's Wharf, San Francisco, CA",
      rating: 4.5,
    },
  },
  {
    id: "loc-5",
    name: "Blue Bottle Coffee",
    description: "Artisanal coffee roaster and cafe",
    latitude: 37.7749,
    longitude: -122.4094,
    category: "cafe",
    icon: MARKER_ICONS.cafe,
    metadata: {
      address: "66 Mint St, San Francisco, CA 94103",
      rating: 4.4,
    },
  },
];

export const mockMarkers: MapMarker[] = mockLocations.map((loc) => ({
  id: loc.id,
  position: [loc.latitude, loc.longitude],
  title: loc.name,
  description: loc.description,
  icon: loc.icon,
  color: getColorByCategory(loc.category),
}));

function getColorByCategory(category?: string): string {
  const colors: Record<string, string> = {
    park: "#22c55e",
    shop: "#f59e0b",
    attraction: "#ec4899",
    restaurant: "#ef4444",
    cafe: "#8b5cf6",
  };
  return colors[category || ""] || "#3b82f6";
}

export const mockRoutes: MapRoute[] = [
  {
    id: "route-1",
    name: "Downtown Tour",
    coordinates: [
      CITY_COORDINATES.sanFrancisco,
      [37.7955, -122.3937], // Ferry Building
      [37.8080, -122.4177], // Fisherman's Wharf
      [37.8267, -122.4230], // Alcatraz
    ],
    color: "#3b82f6",
    weight: 4,
    distance: 8.5,
    duration: 25,
  },
  {
    id: "route-2",
    name: "Park Loop",
    coordinates: [
      [37.7694, -122.4862], // Golden Gate Park
      [37.7749, -122.4094], // Blue Bottle
      [37.7749, -122.4194], // Downtown
      [37.7694, -122.4862], // Back to park
    ],
    color: "#22c55e",
    weight: 4,
    distance: 12.3,
    duration: 35,
  },
];

// Function to generate random markers for testing
export function generateRandomMarkers(count: number, center: [number, number] = CITY_COORDINATES.sanFrancisco): MapMarker[] {
  const markers: MapMarker[] = [];
  const icons = Object.values(MARKER_ICONS);
  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#ef4444", "#8b5cf6"];

  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    markers.push({
      id: `marker-${i}`,
      position: [center[0] + latOffset, center[1] + lngOffset],
      title: `Location ${i + 1}`,
      description: `This is a sample location marker #${i + 1}`,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return markers;
}

