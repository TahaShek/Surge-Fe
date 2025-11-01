# 🚀 Real-time Features Quick Start

Get started with Socket.IO, notifications, and chat in **5 minutes**!

## ⚡ Instant Setup

### 1. Install & Configure (Already Done!)

Your template is **ready to use**! Just set your backend URL:

```bash
# .env file (already created)
VITE_SOCKET_URL=http://localhost:4000
```

### 2. Start Development

```bash
npm run dev
```

### 3. Test Features

Visit these pages **right now**:

- **`/realtime-demo`** - Interactive testing page
- **`/chat`** - Full chat interface
- **`/notifications`** - Notification center
- **Navbar bell icon** - Quick notifications

## 🎯 Using Features

### Notifications (2 lines of code!)

```tsx
import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const { notifications, unreadCount } = useNotifications();
  // That's it! You have notifications now.
}
```

### Chat (3 lines of code!)

```tsx
import { ChatInterface } from "@/features/chat";

function ChatPage() {
  return <ChatInterface />;  // Full chat UI!
}
```

### Custom Events (Simple!)

```tsx
import { useSocketContext } from "@/features/realtime";

function MyFeature() {
  const { emit, on, connected } = useSocketContext();
  
  // Send event
  if (connected) emit("my:event", { data: "hello" });
  
  // Listen to event
  useEffect(() => {
    if (!connected) return;
    on("my:event", (data) => console.log(data));
  }, [connected, on]);
}
```

## 📍 Key Routes

| Route | Description |
|-------|-------------|
| `/realtime-demo` | Test all features interactively |
| `/chat` | Full chat interface |
| `/notifications` | Notification center |

## 🎨 Components Available

### Notification Components
- `<NotificationBell />` - Bell with badge (already in navbar!)
- `<NotificationList />` - Dropdown list
- `<NotificationCenter />` - Full page view
- `useNotifications()` - Hook for data

### Chat Components
- `<ChatInterface />` - Complete chat UI
- `<ChatSidebar />` - Conversations list
- `<ChatWindow />` - Message view
- `<ChatInput />` - Message input
- `useChat()` - Hook for data

## 🔌 Backend Example

### Minimal Socket.IO Server

```javascript
// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket) => {
  console.log("User connected");

  // Send notification
  socket.emit("notification:new", {
    notification: {
      id: "1",
      type: "info",
      title: "Welcome!",
      message: "You're connected",
      read: false,
      createdAt: new Date().toISOString(),
      userId: "user-1",
    }
  });

  // Handle chat message
  socket.on("chat:message", (data) => {
    socket.to(data.roomId).emit("chat:message", { message: data });
  });
});

server.listen(4000);
```

## 📦 Mock Data (No Backend Needed!)

Test without a backend:

```tsx
import { loadMockNotifications } from "@/features/notifications/mocks/mock-notification-data";
import { loadMockChatData } from "@/features/chat/mocks/mock-chat-data";

// Load in your component
const mockNotifs = loadMockNotifications();
const mockChat = loadMockChatData();
```

Or just visit **`/realtime-demo`** and click **"Load Mock Data"**!

## 🎯 Common Use Cases

### 1. Live Dashboard Updates

```tsx
function Dashboard() {
  const { on, connected } = useSocketContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!connected) return;
    on("dashboard:update", setData);
  }, [connected, on]);

  return <div>Active Users: {data?.activeUsers}</div>;
}
```

### 2. User Activity Feed

```tsx
function ActivityFeed() {
  const { notifications } = useNotifications();

  return (
    <div>
      {notifications.slice(0, 10).map(n => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
}
```

### 3. Collaborative Features

```tsx
function CollaborativeEditor() {
  const { emit, on } = useSocketContext();

  const handleChange = (content) => {
    emit("doc:update", { content });
  };

  useEffect(() => {
    on("doc:update", (data) => {
      // Update editor
    });
  }, [on]);
}
```

## 🎨 Customization

### Add Custom Notification Type

```typescript
// 1. Add to types
export type NotificationType = "info" | "success" | "custom";

// 2. Use it
addNotification({
  type: "custom",
  title: "My Custom Notification",
  // ...
});
```

### Add Custom Chat Feature

```tsx
// Extend the chat store
export const useChatStore = create<ChatStore>((set) => ({
  // Add your custom state/actions
}));
```

## 📚 Full Documentation

- **[REALTIME_FEATURES.md](./REALTIME_FEATURES.md)** - Complete guide (recommended)
- **[docs/features/REALTIME.md](./docs/features/REALTIME.md)** - Backend integration
- **[src/features/realtime/README.md](./src/features/realtime/README.md)** - Quick reference

## 🔥 Pro Tips

1. **Start Simple**: Use mock data first, add backend later
2. **Test Live**: Use `/realtime-demo` to test everything
3. **Copy Examples**: All code examples are production-ready
4. **Check Console**: Socket connection logs help debug
5. **Mobile Friendly**: All components work on mobile

## 🆘 Quick Troubleshooting

**Problem**: Socket not connecting  
**Solution**: Check `VITE_SOCKET_URL` in `.env`

**Problem**: Notifications not showing  
**Solution**: Grant browser notification permissions

**Problem**: Chat empty  
**Solution**: Load mock data at `/realtime-demo`

## 🎉 You're Ready!

Everything is set up and ready to use. Just:

1. Visit **`/realtime-demo`** to test
2. Check the **bell icon** in navbar
3. Visit **`/chat`** for messaging
4. Copy the code examples above
5. Start building! 🚀

---

**Questions?** Check the full documentation or inspect the example code in:
- `src/features/realtime/`
- `src/features/notifications/`
- `src/features/chat/`

**Happy Hacking!** 🎊

