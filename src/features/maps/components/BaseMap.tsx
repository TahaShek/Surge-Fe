// Base Map Component
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { TILE_LAYERS, DEFAULT_MAP_CONFIG } from "../config/maps.config";
import type { MapViewport } from "../types/maps.types";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue with Vite
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

interface BaseMapProps {
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tileLayer?: keyof typeof TILE_LAYERS;
  scrollWheelZoom?: boolean;
}

// Component to update map view
function MapUpdater({ viewport }: { viewport: MapViewport }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(viewport.center, viewport.zoom);
  }, [map, viewport]);
  
  return null;
}

export const BaseMap: React.FC<BaseMapProps> = ({
  viewport = {
    center: DEFAULT_MAP_CONFIG.defaultCenter,
    zoom: DEFAULT_MAP_CONFIG.defaultZoom,
  },
  onViewportChange,
  children,
  className = "h-[500px] w-full rounded-lg overflow-hidden border",
  style,
  tileLayer = "openStreetMap",
  scrollWheelZoom = true,
}) => {
  const selectedTileLayer = TILE_LAYERS[tileLayer];

  return (
    <MapContainer
      center={viewport.center}
      zoom={viewport.zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
      style={style}
      whenReady={(map) => {
        if (onViewportChange) {
          map.target.on("moveend", () => {
            const center = map.target.getCenter();
            const zoom = map.target.getZoom();
            onViewportChange({
              center: [center.lat, center.lng],
              zoom,
            });
          });
        }
      }}
    >
      <TileLayer
        attribution={selectedTileLayer.attribution}
        url={selectedTileLayer.url}
      />
      <MapUpdater viewport={viewport} />
      {children}
    </MapContainer>
  );
};

