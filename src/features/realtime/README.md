# Real-time Features Guide

This guide provides everything you need to implement real-time features using Socket.IO in your hackathon project.

## Quick Start

### 1. Setup (Already Done!)

The Socket.IO configuration is already set up. Just make sure you have the `VITE_SOCKET_URL` in your `.env`:

```bash
VITE_SOCKET_URL=http://localhost:4000
```

### 2. Using Real-time Features

#### Notifications

Add the notification bell to your navbar (already added):

```tsx
import { NotificationBell } from "@/features/notifications";

<NotificationBell />
```

Use notifications in your components:

```tsx
import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title}
        </div>
      ))}
    </div>
  );
}
```

#### Chat

Navigate to `/chat` to see the full chat interface, or use the components:

```tsx
import { ChatInterface } from "@/features/chat";

<ChatInterface />
```

Use chat in your components:

```tsx
import { useChat } from "@/features/chat";

function MyChat() {
  const { rooms, activeRoom, sendMessage } = useChat();
  
  const handleSend = (message: string) => {
    if (activeRoom) {
      sendMessage(activeRoom.id, message);
    }
  };
  
  return <div>{/* Your UI */}</div>;
}
```

## Features Included

### ✅ Socket.IO Configuration
- Auto-reconnection
- Connection status tracking
- Event management
- Type-safe events

### ✅ Notifications System
- Real-time notifications
- Browser notifications
- Notification bell with badge
- Full notification center
- Mark as read/unread
- Notification types (info, success, warning, error, mention, message)

### ✅ Chat System
- Real-time messaging
- Direct and group chats
- Typing indicators
- Online/offline status
- Unread message tracking
- Modern WhatsApp-like UI

### ✅ Mock Data
- Ready-to-use mock data for development
- No backend required to start building

## Routes

- `/chat` - Full chat interface
- `/notifications` - Notification center

## Backend Integration

See `docs/features/REALTIME.md` for complete backend integration guide with Node.js/Express examples.

### Quick Backend Example

```javascript
// server.js
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket) => {
  // Send notification
  socket.emit("notification:new", {
    notification: {
      id: "1",
      type: "info",
      title: "Welcome!",
      message: "You're connected",
      read: false,
      createdAt: new Date().toISOString(),
      userId: socket.userId,
    }
  });

  // Handle chat message
  socket.on("chat:message", (data) => {
    io.to(data.roomId).emit("chat:message", { message: data });
  });
});
```

## Customization

### Add Custom Events

```tsx
import { useSocketContext } from "@/features/realtime";

function MyComponent() {
  const { on, off, emit, connected } = useSocketContext();

  useEffect(() => {
    if (!connected) return;
    
    const handler = (data) => console.log(data);
    on("custom:event", handler);
    
    return () => off("custom:event", handler);
  }, [connected, on, off]);

  const sendCustomEvent = () => {
    emit("custom:event", { data: "hello" });
  };
}
```

### Create Custom Hooks

```tsx
export function useCustomRealtime() {
  const { socket, connected, on } = useSocketContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!connected) return;
    on("my:event", setData);
  }, [connected, on]);

  return { data, connected };
}
```

## Best Practices for Hackathons

1. **Start with Mock Data**: Use the provided mock data to build UI first
2. **Progressive Enhancement**: Add real backend integration later
3. **Error Handling**: The socket connection handles reconnection automatically
4. **Performance**: Typing indicators are debounced automatically
5. **UI Feedback**: Show connection status to users

## Common Patterns

### Real-time Dashboard Updates

```tsx
function Dashboard() {
  const { on, connected } = useSocketContext();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!connected) return;
    on("dashboard:update", setStats);
  }, [connected, on]);

  return <div>Active Users: {stats.activeUsers}</div>;
}
```

### Collaborative Editing

```tsx
function CollaborativeEditor() {
  const { emit, on, connected } = useSocketContext();

  const handleChange = (content: string) => {
    if (connected) {
      emit("document:update", { documentId, content });
    }
  };

  useEffect(() => {
    if (!connected) return;
    on("document:update", (data) => {
      // Update editor content
    });
  }, [connected, on]);
}
```

### Live Notifications

```tsx
function LiveFeed() {
  const { notifications } = useNotifications();

  return (
    <div>
      {notifications.slice(0, 5).map(n => (
        <NotificationCard key={n.id} notification={n} />
      ))}
    </div>
  );
}
```

## Troubleshooting

### Connection Issues

The app shows connection status. If disconnected:
1. Check if backend server is running
2. Verify VITE_SOCKET_URL in .env
3. Check CORS settings on backend

### Events Not Firing

1. Make sure socket is connected before emitting
2. Clean up listeners in useEffect return
3. Use the configured event names from SOCKET_CONFIG

### Performance

1. Limit frequent events (typing indicators are auto-throttled)
2. Use rooms for targeted broadcasts
3. Cleanup listeners when components unmount

## Next Steps

- Check `/chat` and `/notifications` pages for working examples
- Read `docs/features/REALTIME.md` for detailed documentation
- Customize mock data in `src/features/*/mocks/`
- Add your custom events and features

## Resources

- Socket.IO Client Docs: https://socket.io/docs/v4/client-api/
- CASL Authorization: https://casl.js.org/v6/en/
- Zustand State Management: https://zustand-demo.pmnd.rs/

Happy Hacking! 🚀

