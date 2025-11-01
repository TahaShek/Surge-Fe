# 🗺️ Maps - 30 Second Quick Start

## ✨ Why This Is Perfect

- ✅ **FREE** - No cost, ever
- ✅ **NO API KEY** - Just works
- ✅ **NO CREDIT CARD** - Zero payment info needed
- ✅ **UNLIMITED** - No usage limits
- ✅ **READY NOW** - Already installed

## 🚀 Start Using (3 Steps)

### 1. See It Working
Visit **`http://localhost:5173/maps`** after running `npm run dev`

### 2. Copy This Code
```tsx
import { MapWithMarkers } from "@/features/maps";

function MyMap() {
  return (
    <MapWithMarkers 
      markers={[{
        id: "1",
        position: [37.7749, -122.4194],
        title: "My Location",
        icon: "📍"
      }]}
    />
  );
}
```

### 3. Done! 🎉

## 📦 What You Get

### 5 Ready-to-Use Components

1. **`<MapWithMarkers />`** - Map with custom markers
2. **`<LocationPicker />`** - Click to pick location
3. **`<RouteMap />`** - Display routes/paths
4. **`<BaseMap />`** - Basic map
5. **`<GeolocationButton />`** - User location

### Mock Data Included

```tsx
import { mockMarkers, mockRoutes } from "@/features/maps";

// Use immediately
<MapWithMarkers markers={mockMarkers} />
<RouteMap routes={mockRoutes} />
```

## 💡 Common Use Cases

### Food Delivery
```tsx
<MapWithMarkers markers={restaurants} />
<RouteMap routes={[deliveryRoute]} />
```

### Store Locator
```tsx
<MapWithMarkers markers={stores} />
<GeolocationButton />
```

### Event Map
```tsx
const markers = events.map(e => ({
  id: e.id,
  position: [e.lat, e.lng],
  title: e.name,
  icon: "🎉"
}));
<MapWithMarkers markers={markers} />
```

### Property Listings
```tsx
<MapWithMarkers markers={properties} />
<LocationPicker onLocationSelect={addProperty} />
```

## 📍 Pre-loaded Cities

```tsx
import { CITY_COORDINATES } from "@/features/maps";

CITY_COORDINATES.sanFrancisco // [37.7749, -122.4194]
CITY_COORDINATES.newYork      // [40.7128, -74.0060]
CITY_COORDINATES.london        // [51.5074, -0.1278]
CITY_COORDINATES.paris         // [48.8566, 2.3522]
CITY_COORDINATES.tokyo         // [35.6762, 139.6503]
// + more!
```

## 🎨 Custom Markers

```tsx
import { MARKER_ICONS } from "@/features/maps";

MARKER_ICONS.restaurant // 🍽️
MARKER_ICONS.hotel      // 🏨
MARKER_ICONS.cafe       // ☕
MARKER_ICONS.shop       // 🛍️
MARKER_ICONS.park       // 🌳
// ... many more!
```

## 📖 Full Documentation

- **`MAPS_GUIDE.md`** - Complete guide with all features
- **`/maps`** route - Live demo with code examples

## 🎓 TypeScript

Full type safety:

```typescript
import type { MapMarker, MapRoute } from "@/features/maps";

const marker: MapMarker = { ... };
```

---

## 🎉 That's It!

**No setup. No config. No API keys. Just works.** 🚀

Visit `/maps` in your app to see it in action!

