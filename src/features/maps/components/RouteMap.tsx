// Route Map Component
import React from "react";
import { Polyline, Marker, Popup } from "react-leaflet";
import { BaseMap } from "./BaseMap";
import type { MapRoute, MapViewport } from "../types/maps.types";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation, Clock, MapPin } from "lucide-react";

interface RouteMapProps {
  routes: MapRoute[];
  viewport?: MapViewport;
  className?: string;
  showStartEnd?: boolean;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  routes,
  viewport,
  className,
  showStartEnd = true,
}) => {
  return (
    <div className="space-y-4">
      {/* Route Info */}
      {routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Navigation className="h-4 w-4" style={{ color: route.color }} />
                    {route.name}
                  </h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {route.distance && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{route.distance.toFixed(2)} km</span>
                      </div>
                    )}
                    {route.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{Math.round(route.duration)} min</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Map */}
      <BaseMap viewport={viewport} className={className}>
        {routes.map((route) => (
          <React.Fragment key={route.id}>
            <Polyline
              positions={route.coordinates}
              color={route.color || "#3b82f6"}
              weight={route.weight || 4}
              opacity={0.7}
            />

            {showStartEnd && route.coordinates.length > 0 && (
              <>
                {/* Start marker */}
                <Marker position={route.coordinates[0]}>
                  <Popup>
                    <div className="text-sm">
                      <strong>Start:</strong> {route.name}
                    </div>
                  </Popup>
                </Marker>

                {/* End marker */}
                <Marker position={route.coordinates[route.coordinates.length - 1]}>
                  <Popup>
                    <div className="text-sm">
                      <strong>End:</strong> {route.name}
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </React.Fragment>
        ))}
      </BaseMap>
    </div>
  );
};

