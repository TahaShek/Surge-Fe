# Modern React Frontend Template

A feature-rich, production-ready React template built with TypeScript, featuring modern UI components, authentication, authorization, and real-time capabilities.

## 🚀 Features

- ⚡️ **[Vite](https://vitejs.dev/)** - Lightning fast build tool
- 🎨 **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- 🔒 **Authentication** - Complete auth system with mock service
- 🛡️ **[CASL](https://casl.js.org/)** - Simple, powerful permissions
- 🌙 **Dark Mode** - Elegant theme switching
- 🔄 **Real-time Features** - Socket.IO with notifications & chat
- 💬 **Chat System** - Full-featured messaging with typing indicators
- 🔔 **Notifications** - Real-time push notifications
- 🗺️ **Maps Integration** - Leaflet + OpenStreetMap (free, no API key!)
- 📊 **Analytics** - Modern dashboard with charts
- 🎯 **Type Safety** - Full TypeScript support

## 📦 Quick Start

   ```bash
# Clone the repository
git clone https://github.com/yourusername/frontend-template.git

# Install dependencies
   npm install

# Start development server
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── app/                # App-specific components
│   ├── pages/         # Page components
│   └── routes/        # Route definitions
│
├── components/        # Shared components
│   ├── ui/           # UI components (shadcn)
│   └── form/         # Form components
│
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── authorization/# Permissions (CASL)
│   ├── layout/      # Layout components
│   ├── realtime/    # Socket.IO integration
│   ├── notifications/# Notification system
│   ├── chat/        # Chat system
│   └── maps/        # Maps integration
│
├── lib/             # Utilities & configurations
└── contexts/        # React contexts
```

## 🎨 Components

### UI Components

1. **Tabs**
```tsx
<TabsContainer 
  tabs={[
    {
      key: 'tab1',
      label: 'Details',
      icon: <Icon />,
      content: <Content />
    }
  ]}
  variant="modern"  // 'modern' | 'pills' | 'underline'
  orientation="horizontal"  // 'horizontal' | 'vertical'
/>
```

2. **Loading States**
```tsx
<LoadingSkeleton 
  variant="card"  // 'card' | 'table' | 'form' | 'list'
  count={3}
/>
```

3. **Toast Notifications**
```tsx
const toast = useToast();

toast.success({
  title: 'Success',
  description: 'Operation completed',
  action: {
    label: 'Undo',
    onClick: () => handleUndo()
  }
});
```

4. **Dialogs**
```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Confirm Action"
  loading={loading}
  onConfirm={handleConfirm}
/>
```

## 🔒 Authentication & Authorization

### Authentication

```tsx
// Login
const { login } = useAuthStore();
await login({ email, password });

// Protected Route
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Authorization (CASL)

```tsx
// Check permissions
const { can } = usePermissions();
if (can('create', 'User')) {
  // ...
}

// Protect UI elements
<Can I="update" a="User">
  <EditButton />
</Can>

// Protect routes
<PermissionGuard subject="Dashboard">
  <DashboardPage />
</PermissionGuard>
```

## 🎯 Type Safety

```typescript
// Action & Subject types
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Dashboard' | 'User' | 'Settings' | 'all';

// Permission type
interface Permission {
  action: Actions;
  subject: Subjects;
}
```

## 🌈 Theme Support

```tsx
// Theme Provider
<ThemeProvider defaultTheme="system" storageKey="app-theme">
  <App />
</ThemeProvider>

// Use theme
const { theme, setTheme } = useTheme();
```

## 📊 Dashboard Features

- Modern analytics charts
- Real-time data updates
- Interactive data visualization
- Responsive layout
- Loading states
- Error handling

## 🔄 Real-time Features

### 🚀 **NEW: Complete Socket.IO Integration!**

This template now includes production-ready real-time features:

#### 🔔 Notifications System
```tsx
import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title} - {n.message}
        </div>
      ))}
    </div>
  );
}

// Notification bell already added to navbar!
```

#### 💬 Chat System
```tsx
import { useChat } from "@/features/chat";

function MyChat() {
  const { rooms, activeRoom, sendMessage } = useChat();
  
  const handleSend = (message: string) => {
    if (activeRoom) {
      sendMessage(activeRoom.id, message);
    }
  };
  
  return <ChatInterface />;  // Full chat UI included!
}
```

#### 🎯 Custom Socket Events
```tsx
import { useSocketContext } from "@/features/realtime";

function CustomFeature() {
  const { on, off, emit, connected } = useSocketContext();

  useEffect(() => {
    if (!connected) return;
    on("custom:event", (data) => console.log(data));
    return () => off("custom:event");
  }, [connected, on, off]);
}
```

### 📍 Try It Now!
- Visit `/realtime-demo` for interactive demo
- Visit `/chat` for full chat interface
- Visit `/notifications` for notification center
- Check the **bell icon** in navbar for notifications

### 📚 Complete Documentation
- [Real-time Features Guide](./REALTIME_FEATURES.md) - Complete guide
- [Detailed Documentation](./docs/features/REALTIME.md) - Backend integration
- [Quick Start](./src/features/realtime/README.md) - Quick reference

### ✨ What's Included
- ✅ Socket.IO client with auto-reconnection
- ✅ Real-time notifications with browser push
- ✅ Full chat system (direct & group chats)
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Unread message tracking
- ✅ Mock data for instant development
- ✅ Type-safe events
- ✅ Production-ready architecture

## 🗺️ Maps Integration

### 🚀 **NEW: Free Maps with Leaflet + OpenStreetMap!**

**No API key. No credit card. No limits.** Perfect for hackathons!

```tsx
import { MapWithMarkers, CITY_COORDINATES, MARKER_ICONS } from "@/features/maps";

function MyMap() {
  return (
    <MapWithMarkers 
      markers={[{
        id: "1",
        position: CITY_COORDINATES.sanFrancisco,
        title: "My Location",
        icon: MARKER_ICONS.restaurant,
        color: "#ef4444"
      }]}
    />
  );
}
```

### 📦 5 Ready Components
- `<MapWithMarkers />` - Display markers on map
- `<LocationPicker />` - Click to select location  
- `<RouteMap />` - Show routes and paths
- `<GeolocationButton />` - Get user location
- `<BaseMap />` - Basic map container

### 📍 Try It Now!
- Visit `/maps` for interactive demo
- Check **`MAPS_QUICK_START.md`** for 30-second start
- Read **`MAPS_GUIDE.md`** for complete features

### ✨ Features
- ✅ 18+ marker icons
- ✅ Custom colors
- ✅ 3 map themes
- ✅ 10+ pre-loaded cities
- ✅ Mock data included
- ✅ TypeScript support
- ✅ Mobile responsive

## 🧪 Test Users

```typescript
// Admin (full access)
email: admin@example.com
password: admin123

// Manager
email: manager@example.com
password: manager123

// Regular User
email: user@example.com
password: user123

// Guest
email: guest@example.com
password: guest123
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🛠️ Development Tools

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vite for fast development
- shadcn/ui for components

## 🔧 Configuration

```typescript
// Theme configuration
// src/index.css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  // ...
}

// Vite configuration
// vite.config.ts
export default defineConfig({
  // ...
});
```

## 📚 Documentation

Detailed documentation for each feature:
- [Maps Guide](./MAPS_GUIDE.md) - **NEW!** Free maps (no API key required!)
- [Real-time Features Guide](./REALTIME_FEATURES.md) - Complete Socket.IO guide
- [Real-time Backend Integration](./docs/features/REALTIME.md) - Backend setup
- [Authentication Guide](./docs/features/AUTHENTICATION.md)
- [Authorization Guide](./docs/features/AUTHORIZATION.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT

---

Built with ❤️ for modern web development