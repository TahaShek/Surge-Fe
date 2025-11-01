// Maps Types
export interface Location {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
  icon?: string;
  metadata?: {
    address?: string;
    phone?: string;
    website?: string;
    rating?: number;
    [key: string]: unknown;
  };
}

export interface MapMarker {
  id: string;
  position: [number, number]; // [latitude, longitude]
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  onClick?: () => void;
}

export interface MapRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  color?: string;
  weight?: number;
  distance?: number;
  duration?: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface MapConfig {
  defaultCenter: [number, number];
  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;
  enableSearch?: boolean;
  enableGeolocation?: boolean;
  enableFullscreen?: boolean;
}

