// Geolocation Button Component
import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Crosshair, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GeolocationButtonProps {
  onLocationFound?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

export const GeolocationButton: React.FC<GeolocationButtonProps> = ({
  onLocationFound,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const map = useMap();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        
        if (onLocationFound) {
          onLocationFound({ lat: latitude, lng: longitude });
        }
        
        toast.success("Location found!");
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to get your location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleGetLocation}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crosshair className="h-4 w-4" />
      )}
      <span className="ml-2">{loading ? "Finding..." : "My Location"}</span>
    </Button>
  );
};

