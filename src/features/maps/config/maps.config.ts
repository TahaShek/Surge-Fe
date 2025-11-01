// Maps Configuration
import type { MapConfig } from "../types/maps.types";

// Default map configuration
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [37.7749, -122.4194], // San Francisco
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 18,
  enableSearch: true,
  enableGeolocation: true,
  enableFullscreen: true,
};

// Tile layer options (OpenStreetMap - Free, no API key needed!)
export const TILE_LAYERS = {
  openStreetMap: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    name: "OpenStreetMap",
  },
  openStreetMapDark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    name: "Dark Mode",
  },
  openStreetMapLight: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    name: "Light Mode",
  },
} as const;

// Popular city coordinates for quick reference
export const CITY_COORDINATES = {
  sanFrancisco: [37.7749, -122.4194] as [number, number],
  newYork: [40.7128, -74.0060] as [number, number],
  london: [51.5074, -0.1278] as [number, number],
  paris: [48.8566, 2.3522] as [number, number],
  tokyo: [35.6762, 139.6503] as [number, number],
  sydney: [-33.8688, 151.2093] as [number, number],
  dubai: [25.2048, 55.2708] as [number, number],
  singapore: [1.3521, 103.8198] as [number, number],
  losAngeles: [34.0522, -118.2437] as [number, number],
  chicago: [41.8781, -87.6298] as [number, number],
} as const;

// Map marker icons (using emoji for simplicity)
export const MARKER_ICONS = {
  default: "📍",
  restaurant: "🍽️",
  hotel: "🏨",
  cafe: "☕",
  shop: "🛍️",
  park: "🌳",
  hospital: "🏥",
  school: "🏫",
  office: "🏢",
  home: "🏠",
  airport: "✈️",
  train: "🚂",
  bus: "🚌",
  parking: "🅿️",
  warning: "⚠️",
  info: "ℹ️",
  star: "⭐",
  flag: "🚩",
} as const;

