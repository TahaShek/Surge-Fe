// Location Picker Component
import React, { useState } from "react";
import { useMapEvents, Marker } from "react-leaflet";
import { BaseMap } from "./BaseMap";
import type { MapViewport } from "../types/maps.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Check, X } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  onCancel?: () => void;
  initialLocation?: [number, number];
  viewport?: MapViewport;
  className?: string;
}

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: [number, number] | null;
  onPositionChange: (position: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  onCancel,
  initialLocation,
  viewport,
  className,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState("");

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect({
        lat: selectedPosition[0],
        lng: selectedPosition[1],
        address: address || undefined,
      });
    }
  };

  const handleCancel = () => {
    setSelectedPosition(null);
    setAddress("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Click on the map to select a location</span>
            </div>

            {selectedPosition && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Latitude</Label>
                    <Input
                      value={selectedPosition[0].toFixed(6)}
                      readOnly
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Longitude</Label>
                    <Input
                      value={selectedPosition[1].toFixed(6)}
                      readOnly
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Address (Optional)</Label>
                  <Input
                    placeholder="Enter address or description"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleConfirm} className="flex-1" size="sm">
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Location
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BaseMap viewport={viewport} className={className}>
        <LocationMarker
          position={selectedPosition}
          onPositionChange={setSelectedPosition}
        />
      </BaseMap>
    </div>
  );
};

