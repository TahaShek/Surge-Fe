// Maps Demo Page
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapWithMarkers } from "../components/MapWithMarkers";
import { LocationPicker } from "../components/LocationPicker";
import { RouteMap } from "../components/RouteMap";
import { mockMarkers, mockRoutes, generateRandomMarkers } from "../mocks/mock-locations";
import { CITY_COORDINATES } from "../config/maps.config";
import { MapPin, Navigation, Crosshair, Code } from "lucide-react";
import type { MapMarker } from "../types/maps.types";

export const MapsPage: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarker[]>(mockMarkers);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const handleAddRandomMarkers = () => {
    const newMarkers = generateRandomMarkers(5);
    setMarkers([...markers, ...newMarkers]);
  };

  const handleClearMarkers = () => {
    setMarkers(mockMarkers);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Maps Integration</h1>
        <p className="text-muted-foreground mt-2">
          Free maps with Leaflet + OpenStreetMap - No API key required!
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Free & No Credit Card Required
          </CardTitle>
          <CardDescription>
            Using Leaflet with OpenStreetMap - completely free, no API keys, no credit cards needed.
            Perfect for hackathons!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="markers">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="markers">
            <MapPin className="h-4 w-4 mr-2" />
            Markers
          </TabsTrigger>
          <TabsTrigger value="picker">
            <Crosshair className="h-4 w-4 mr-2" />
            Location Picker
          </TabsTrigger>
          <TabsTrigger value="routes">
            <Navigation className="h-4 w-4 mr-2" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            Code Examples
          </TabsTrigger>
        </TabsList>

        {/* Markers Tab */}
        <TabsContent value="markers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Map with Custom Markers</CardTitle>
              <CardDescription>
                Click on markers to see popups. Customize icons, colors, and interactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleAddRandomMarkers} size="sm">
                  Add Random Markers
                </Button>
                <Button onClick={handleClearMarkers} variant="outline" size="sm">
                  Reset
                </Button>
              </div>

              <MapWithMarkers
                markers={markers}
                viewport={{ center: CITY_COORDINATES.sanFrancisco, zoom: 12 }}
                onMarkerClick={(marker) => {
                  console.log("Marker clicked:", marker);
                }}
              />

              <div className="text-sm text-muted-foreground">
                <strong>Markers loaded:</strong> {markers.length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Picker Tab */}
        <TabsContent value="picker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Picker</CardTitle>
              <CardDescription>
                Click anywhere on the map to select a location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationPicker
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  console.log("Location selected:", location);
                }}
                viewport={{ center: CITY_COORDINATES.sanFrancisco, zoom: 13 }}
              />

              {selectedLocation && (
                <Card className="bg-primary/5 border-primary/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Selected Location:</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}</p>
                      <p><strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}</p>
                      {selectedLocation.address && (
                        <p><strong>Address:</strong> {selectedLocation.address}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Planning</CardTitle>
              <CardDescription>
                Display routes, calculate distances, and show multiple paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RouteMap
                routes={mockRoutes}
                viewport={{ center: CITY_COORDINATES.sanFrancisco, zoom: 12 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Examples Tab */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Code Examples</CardTitle>
              <CardDescription>
                Copy-paste these examples to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Example 1 */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">1. Basic Map with Markers</h3>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`import { MapWithMarkers } from "@/features/maps";

const markers = [
  {
    id: "1",
    position: [37.7749, -122.4194],
    title: "San Francisco",
    description: "Golden Gate City",
    icon: "📍",
    color: "#3b82f6"
  }
];

function MyMap() {
  return (
    <MapWithMarkers 
      markers={markers}
      viewport={{ center: [37.7749, -122.4194], zoom: 13 }}
    />
  );
}`}
                </pre>
              </div>

              {/* Example 2 */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">2. Location Picker</h3>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`import { LocationPicker } from "@/features/maps";

function MyLocationPicker() {
  return (
    <LocationPicker
      onLocationSelect={(location) => {
        console.log("Selected:", location);
        // Use location.lat, location.lng, location.address
      }}
    />
  );
}`}
                </pre>
              </div>

              {/* Example 3 */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">3. Routes</h3>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`import { RouteMap } from "@/features/maps";

const routes = [{
  id: "route-1",
  name: "My Route",
  coordinates: [
    [37.7749, -122.4194],
    [37.8080, -122.4177],
  ],
  color: "#3b82f6",
  distance: 5.2,
  duration: 15
}];

function MyRoutes() {
  return <RouteMap routes={routes} />;
}`}
                </pre>
              </div>

              {/* Example 4 */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">4. Geolocation</h3>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`import { BaseMap, GeolocationButton } from "@/features/maps";
import { MapContainer } from "react-leaflet";

function MyMapWithLocation() {
  return (
    <BaseMap>
      <GeolocationButton 
        onLocationFound={(location) => {
          console.log("User location:", location);
        }}
      />
    </BaseMap>
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

