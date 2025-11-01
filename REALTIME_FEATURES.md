# 🚀 Real-time Features - Complete Guide

This hackathon-ready template includes production-ready Socket.IO integration with notifications and chat features.

## 🎯 Quick Start

### 1. Environment Setup

Create a `.env` file:

```bash
VITE_SOCKET_URL=http://localhost:4000  # Your Socket.IO server URL
```

### 2. Try It Out

The features are already integrated! Just run:

```bash
npm run dev
```

Visit these pages:
- `/realtime-demo` - Interactive demo and testing page
- `/chat` - Full chat interface
- `/notifications` - Notification center

### 3. See It in Action

- Click the **bell icon** in the navbar for notifications
- Click **Chat** in the sidebar for messaging
- Visit `/realtime-demo` to test all features

## ✨ What's Included

### 📡 Socket.IO Setup
- ✅ Auto-reconnection with exponential backoff
- ✅ Connection status tracking
- ✅ Type-safe event management
- ✅ JWT authentication support
- ✅ Environment-based configuration

### 🔔 Notifications System
- ✅ Real-time push notifications
- ✅ Browser notifications (with permission)
- ✅ Notification bell with unread badge
- ✅ Full notification center page
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ 6 notification types (info, success, warning, error, mention, message)
- ✅ Zustand state management

### 💬 Chat System
- ✅ Real-time messaging
- ✅ Direct messages & group chats
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Unread message badges
- ✅ WhatsApp-style modern UI
- ✅ Auto-scroll to new messages
- ✅ Message timestamps

### 🎨 UI Components
- ✅ NotificationBell (navbar integration)
- ✅ NotificationList (dropdown)
- ✅ NotificationCenter (full page)
- ✅ ChatInterface (complete chat UI)
- ✅ ChatSidebar (conversations list)
- ✅ ChatWindow (message view)
- ✅ All built with shadcn/ui + Tailwind

### 🧪 Development Tools
- ✅ Mock data for instant development
- ✅ Interactive demo page (`/realtime-demo`)
- ✅ TypeScript types for all features
- ✅ Comprehensive documentation

## 📁 Architecture

```
src/features/
├── realtime/              # Core Socket.IO setup
│   ├── config/           # Configuration
│   ├── context/          # React context provider
│   ├── hooks/            # useSocket hook
│   └── examples/         # Demo page
│
├── notifications/         # Notification feature
│   ├── components/       # UI components
│   ├── hooks/            # useNotifications
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   ├── mocks/            # Mock data
│   └── pages/            # Notification center
│
└── chat/                 # Chat feature
    ├── components/       # UI components
    ├── hooks/            # useChat
    ├── store/            # Zustand store
    ├── types/            # TypeScript types
    ├── mocks/            # Mock data
    └── pages/            # Chat page
```

## 🔧 Usage Examples

### Using Notifications

```tsx
import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <h2>You have {unreadCount} unread notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Chat

```tsx
import { useChat } from "@/features/chat";

function MyChat() {
  const { 
    rooms, 
    activeRoom, 
    activeMessages, 
    sendMessage,
    setActiveRoom 
  } = useChat();
  
  const handleSend = (message: string) => {
    if (activeRoom) {
      sendMessage(activeRoom.id, message);
    }
  };
  
  return (
    <div>
      {/* Room list */}
      {rooms.map(room => (
        <div key={room.id} onClick={() => setActiveRoom(room.id)}>
          {room.name} ({room.unreadCount})
        </div>
      ))}
      
      {/* Messages */}
      {activeMessages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      
      {/* Send */}
      <input onSubmit={(e) => handleSend(e.target.value)} />
    </div>
  );
}
```

### Custom Socket Events

```tsx
import { useSocketContext } from "@/features/realtime";

function CustomFeature() {
  const { on, off, emit, connected } = useSocketContext();

  useEffect(() => {
    if (!connected) return;
    
    const handler = (data) => {
      console.log("Received:", data);
    };
    
    on("custom:event", handler);
    return () => off("custom:event", handler);
  }, [connected, on, off]);

  const sendCustomEvent = () => {
    emit("custom:event", { message: "Hello!" });
  };
  
  return <button onClick={sendCustomEvent}>Send</button>;
}
```

## 🔌 Backend Integration

### Node.js + Express + Socket.IO

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify JWT token here
  if (token) {
    socket.userId = getUserIdFromToken(token);
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Notification example
  socket.emit("notification:new", {
    notification: {
      id: generateId(),
      type: "info",
      title: "Welcome!",
      message: "You're connected to the server",
      read: false,
      createdAt: new Date().toISOString(),
      userId: socket.userId,
    },
  });

  // Chat message
  socket.on("chat:message", (data) => {
    const message = {
      id: generateId(),
      roomId: data.roomId,
      senderId: socket.userId,
      content: data.content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Save to database
    saveMessage(message);
    
    // Broadcast to room
    io.to(data.roomId).emit("chat:message", { message });
  });

  // Typing indicator
  socket.on("chat:typing", (data) => {
    socket.to(data.roomId).emit("chat:typing", {
      roomId: data.roomId,
      userId: socket.userId,
      userName: socket.userName,
      isTyping: data.isTyping,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
```

## 📚 Event Reference

### Notification Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `notification:new` | Server → Client | `{ notification: Notification }` | New notification |
| `notification:read` | Client → Server | `{ notificationId: string }` | Mark as read |
| `notification:read_all` | Client → Server | `{}` | Mark all as read |
| `notification:delete` | Client → Server | `{ notificationId: string }` | Delete notification |

### Chat Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:message` | Bidirectional | `{ message: Message }` | Send/receive message |
| `chat:typing` | Bidirectional | `{ roomId, userId, userName, isTyping }` | Typing indicator |
| `chat:join_room` | Client → Server | `{ roomId: string }` | Join chat room |
| `chat:leave_room` | Client → Server | `{ roomId: string }` | Leave chat room |
| `chat:message:read` | Client → Server | `{ roomId: string }` | Mark messages as read |
| `chat:user:online` | Server → Client | `{ userId: string }` | User online |
| `chat:user:offline` | Server → Client | `{ userId: string }` | User offline |

## 🎨 Customization

### Add New Notification Type

1. Update the type in `src/features/notifications/types/notification.types.ts`:
```typescript
export type NotificationType = "info" | "success" | "warning" | "error" | "mention" | "message" | "custom";
```

2. Add icon and color in `NotificationItem.tsx`

### Create Custom Chat Room Type

1. Update `ChatRoom` type in `src/features/chat/types/chat.types.ts`
2. Add custom UI in `ChatRoomItem.tsx`

### Add Custom Socket Events

1. Add event name to `SOCKET_CONFIG.events` in `socket.config.ts`
2. Use in your components with `useSocketContext`

## 📖 Documentation

- **Full Documentation**: `docs/features/REALTIME.md`
- **Quick Start**: `src/features/realtime/README.md`
- **Architecture**: `docs/ARCHITECTURE.md`

## 🧪 Testing

Visit `/realtime-demo` for:
- Connection status testing
- Event emission testing
- Mock data loading
- Real-time event logs
- Code examples

## 🚀 Deployment Checklist

- [ ] Set `VITE_SOCKET_URL` to production server
- [ ] Implement JWT authentication
- [ ] Set up database for messages/notifications
- [ ] Configure CORS on backend
- [ ] Enable SSL/TLS for production
- [ ] Set up Redis for Socket.IO scaling (if needed)
- [ ] Implement rate limiting
- [ ] Add error tracking (Sentry, etc.)

## 💡 Tips for Hackathons

1. **Start with Mock Data**: Build UI first, add backend later
2. **Use the Demo Page**: Test features quickly at `/realtime-demo`
3. **Copy-Paste Ready**: All components are ready to use
4. **Extend Easily**: Add custom events without breaking existing features
5. **Type-Safe**: TypeScript catches errors before runtime
6. **Mobile Responsive**: All UI components work on mobile

## 🤝 Contributing

This is a template! Fork it, customize it, make it yours. Some ideas:

- Add voice/video calling
- Implement file sharing in chat
- Add emoji picker
- Create notification sounds
- Add message reactions
- Implement read receipts
- Add user presence (typing, online status)
- Create notification preferences

## 📦 Dependencies

Core dependencies (already installed):
- `socket.io-client` - Socket.IO client
- `zustand` - State management
- `date-fns` - Date formatting
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons

## 🆘 Troubleshooting

### Socket not connecting?
1. Check `VITE_SOCKET_URL` in `.env`
2. Ensure backend server is running
3. Verify CORS settings on backend
4. Check browser console for errors

### Notifications not showing?
1. Grant browser notification permissions
2. Check if `NotificationBell` is in navbar
3. Verify mock data is loaded
4. Check console for errors

### Chat not working?
1. Load mock data at `/realtime-demo`
2. Check if rooms are loaded in sidebar
3. Verify socket connection
4. Check browser console

## 📞 Support

For issues or questions:
1. Check the documentation in `docs/features/REALTIME.md`
2. Visit the demo page at `/realtime-demo`
3. Review code examples in `src/features/*/examples/`

---

**Built for Hackathons** | **Production Ready** | **Type Safe** | **Fully Documented**

Happy Hacking! 🎉

