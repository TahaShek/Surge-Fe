// Map with Markers Component
import React, { useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { BaseMap } from "./BaseMap";
import type { MapMarker, MapViewport } from "../types/maps.types";
import { Button } from "@/components/ui/button";
import L from "leaflet";

interface MapWithMarkersProps {
  markers: MapMarker[];
  viewport?: MapViewport;
  onMarkerClick?: (marker: MapMarker) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  className?: string;
  showPopups?: boolean;
}

// Custom marker icon component
function createCustomIcon(emoji: string, color: string = "#3b82f6") {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">${emoji || "📍"}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

// Component to fit bounds to all markers
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => m.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

export const MapWithMarkers: React.FC<MapWithMarkersProps> = ({
  markers,
  viewport,
  onMarkerClick,
  onViewportChange,
  className,
  showPopups = true,
}) => {
  const [autoFit, setAutoFit] = useState(true);

  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.onClick) {
      marker.onClick();
    }
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  return (
    <div className="relative">
      <BaseMap
        viewport={viewport}
        onViewportChange={onViewportChange}
        className={className}
      >
        {autoFit && <FitBounds markers={markers} />}
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createCustomIcon(marker.icon, marker.color)}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            {showPopups && (
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{marker.title}</h3>
                  {marker.description && (
                    <p className="text-xs text-muted-foreground">{marker.description}</p>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </BaseMap>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setAutoFit(!autoFit)}
          className="bg-white shadow-lg"
        >
          {autoFit ? "Manual" : "Auto Fit"}
        </Button>
      </div>
    </div>
  );
};

