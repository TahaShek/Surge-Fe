# Real-time Features Documentation

This guide covers the Socket.IO integration and real-time features including notifications and chat.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Socket.IO Configuration](#socketio-configuration)
3. [Notifications Feature](#notifications-feature)
4. [Chat Feature](#chat-feature)
5. [Backend Integration](#backend-integration)
6. [Examples](#examples)

---

## Architecture Overview

The real-time features are built using Socket.IO client and follow a feature-based architecture:

```
src/features/
├── realtime/           # Socket.IO configuration and context
│   ├── config/
│   │   └── socket.config.ts
│   ├── context/
│   │   └── SocketProvider.tsx
│   ├── hooks/
│   │   └── useSocket.ts
│   └── types.ts
├── notifications/      # Notification feature
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   └── mocks/
└── chat/              # Chat feature
    ├── components/
    ├── hooks/
    ├── store/
    ├── types/
    ├── mocks/
    └── pages/
```

### Key Features

- **Modular Architecture**: Each feature is self-contained
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand stores for each feature
- **Real-time Updates**: Socket.IO event handling
- **Automatic Reconnection**: Built-in connection management
- **Mock Data**: Development-ready mock implementations

---

## Socket.IO Configuration

### Setup

The Socket.IO client is configured in `src/features/realtime/config/socket.config.ts`:

```typescript
export const SOCKET_CONFIG = {
  url: import.meta.env.VITE_SOCKET_URL || "http://localhost:4000",
  options: {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
  events: {
    // All socket event names
    NOTIFICATION_NEW: "notification:new",
    CHAT_MESSAGE: "chat:message",
    // ... more events
  },
};
```

### Environment Variables

Add to your `.env`:

```bash
VITE_SOCKET_URL=http://localhost:4000
```

### Provider Setup

Wrap your app with the SocketProvider in `main.tsx`:

```tsx
import { SocketProvider } from "@/features/realtime";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
```

### Using the Socket Context

```tsx
import { useSocketContext } from "@/features/realtime";

function MyComponent() {
  const { socket, connected, emit, on, off } = useSocketContext();

  useEffect(() => {
    if (!connected) return;

    const handler = (data) => {
      console.log("Received:", data);
    };

    on("custom:event", handler);
    return () => off("custom:event", handler);
  }, [connected, on, off]);

  const sendData = () => {
    emit("custom:event", { message: "Hello!" });
  };

  return (
    <div>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <button onClick={sendData}>Send</button>
    </div>
  );
}
```

---

## Notifications Feature

### Overview

The notifications feature provides real-time notifications with:

- Browser notifications
- In-app notification bell
- Full notification center
- Read/unread tracking
- Multiple notification types

### Usage

#### 1. Add the Notification Bell to your Navbar

```tsx
import { NotificationBell } from "@/features/notifications";

export function Navbar() {
  return (
    <nav>
      {/* Other nav items */}
      <NotificationBell />
    </nav>
  );
}
```

#### 2. Use the Notifications Hook

```tsx
import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{notif.title}</p>
          <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>
          <button onClick={() => deleteNotification(notif.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### 3. Full Notification Center Page

```tsx
import { NotificationPage } from "@/features/notifications/pages/NotificationPage";

// In your routes
<Route path="/notifications" element={<NotificationPage />} />
```

### Notification Types

- `info`: General information
- `success`: Success messages
- `warning`: Warning messages
- `error`: Error messages
- `mention`: User mentions
- `message`: Chat messages

### Store API

```tsx
import { useNotificationStore } from "@/features/notifications";

const {
  notifications,
  unreadCount,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
} = useNotificationStore();
```

---

## Chat Feature

### Overview

The chat feature provides a complete real-time chat interface with:

- Direct messages and group chats
- Real-time message delivery
- Typing indicators
- Online/offline status
- Unread message tracking
- Modern WhatsApp-like UI

### Usage

#### 1. Chat Page

```tsx
import { ChatPage } from "@/features/chat/pages/ChatPage";

// In your routes
<Route path="/chat" element={<ChatPage />} />
```

#### 2. Using the Chat Hook

```tsx
import { useChat } from "@/features/chat";

function ChatComponent() {
  const {
    rooms,
    activeRoom,
    activeMessages,
    connected,
    sendMessage,
    setActiveRoom,
  } = useChat();

  const handleSend = (content: string) => {
    if (activeRoom) {
      sendMessage(activeRoom.id, content);
    }
  };

  return (
    <div>
      {/* Room list */}
      {rooms.map((room) => (
        <div key={room.id} onClick={() => setActiveRoom(room.id)}>
          {room.name} ({room.unreadCount})
        </div>
      ))}

      {/* Messages */}
      {activeMessages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.senderName}:</strong> {msg.content}
        </div>
      ))}

      {/* Send message */}
      <input onSubmit={(e) => handleSend(e.target.value)} />
    </div>
  );
}
```

#### 3. Embedding Chat Components

```tsx
import {
  ChatInterface,
  ChatSidebar,
  ChatWindow,
} from "@/features/chat";

// Use the full interface
<ChatInterface />

// Or build custom layouts
<div className="flex">
  <ChatSidebar />
  <ChatWindow />
</div>
```

### Chat Store API

```tsx
import { useChatStore } from "@/features/chat";

const {
  rooms,
  messages,
  activeRoomId,
  typingUsers,
  onlineUsers,
  addMessage,
  setActiveRoom,
  markMessagesAsRead,
} = useChatStore();
```

---

## Backend Integration

### Node.js/Express + Socket.IO Example

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify token here
  if (token) {
    socket.userId = getUserIdFromToken(token);
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Notification events
  socket.on("notification:read", (data) => {
    // Mark notification as read in DB
    console.log("Mark as read:", data.notificationId);
  });

  // Chat events
  socket.on("chat:join_room", (data) => {
    socket.join(data.roomId);
    console.log(`User ${socket.userId} joined room ${data.roomId}`);
  });

  socket.on("chat:message", (data) => {
    const message = {
      id: generateId(),
      roomId: data.roomId,
      senderId: socket.userId,
      senderName: socket.userName,
      content: data.content,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    };

    // Save to DB
    saveMessage(message);

    // Emit to room
    io.to(data.roomId).emit("chat:message", { message });
  });

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
  console.log("Server running on port 4000");
});
```

### Event Reference

#### Notifications

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `notification:new` | Server → Client | `{ notification: Notification }` | New notification received |
| `notification:read` | Client → Server | `{ notificationId: string }` | Mark notification as read |
| `notification:read_all` | Client → Server | `{}` | Mark all as read |
| `notification:delete` | Client → Server | `{ notificationId: string }` | Delete notification |

#### Chat

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:message` | Bidirectional | `{ message: Message }` | Send/receive message |
| `chat:typing` | Bidirectional | `{ roomId, userId, userName, isTyping }` | Typing indicator |
| `chat:join_room` | Client → Server | `{ roomId: string }` | Join chat room |
| `chat:leave_room` | Client → Server | `{ roomId: string }` | Leave chat room |
| `chat:message:read` | Client → Server | `{ roomId: string }` | Mark messages as read |
| `chat:user:online` | Server → Client | `{ userId: string }` | User came online |
| `chat:user:offline` | Server → Client | `{ userId: string }` | User went offline |

---

## Examples

### Example 1: Send Custom Notification from Backend

```javascript
// Backend
io.to(userId).emit("notification:new", {
  notification: {
    id: "notif-123",
    type: "success",
    title: "Payment Received",
    message: "You received $100",
    read: false,
    createdAt: new Date().toISOString(),
    userId: userId,
    metadata: {
      actionUrl: "/payments/123",
      actionLabel: "View details",
    },
  },
});
```

### Example 2: Broadcast to Room

```javascript
// Backend
io.to("room-123").emit("chat:message", {
  message: {
    id: "msg-456",
    roomId: "room-123",
    senderId: "system",
    senderName: "System",
    content: "Welcome to the chat!",
    timestamp: new Date().toISOString(),
    read: false,
    type: "system",
  },
});
```

### Example 3: Custom Hook for Specific Events

```tsx
// Frontend
import { useEffect } from "react";
import { useSocketContext } from "@/features/realtime";

export function useCustomEvent(eventName: string, handler: (data: any) => void) {
  const { connected, on, off } = useSocketContext();

  useEffect(() => {
    if (!connected) return;
    on(eventName, handler);
    return () => off(eventName, handler);
  }, [connected, eventName, handler, on, off]);
}

// Usage
function MyComponent() {
  useCustomEvent("custom:event", (data) => {
    console.log("Custom event received:", data);
  });
}
```

---

## Best Practices

1. **Always check connection status** before emitting events
2. **Clean up listeners** in useEffect return functions
3. **Use TypeScript types** for all payloads
4. **Implement error handling** for failed connections
5. **Test with mock data** before backend integration
6. **Rate limit** typing indicators and frequent events
7. **Authenticate** socket connections with JWT tokens
8. **Validate** all incoming socket data on backend
9. **Use rooms** for targeted broadcasts
10. **Monitor** socket connections and performance

---

## Troubleshooting

### Connection Issues

```tsx
const { connected, error, reconnectAttempts } = useSocketContext();

if (error) {
  console.error("Socket error:", error);
}

if (reconnectAttempts > 0) {
  console.log(`Reconnecting... attempt ${reconnectAttempts}`);
}
```

### Debug Mode

Enable detailed logging:

```typescript
// In socket.config.ts
options: {
  // ... other options
  debug: true,
}
```

### CORS Issues

Ensure backend CORS is configured:

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
```

---

## Next Steps

- Implement file upload in chat
- Add voice/video calling
- Implement message reactions
- Add message search
- Implement notification preferences
- Add push notifications
- Implement presence system
- Add message encryption

For more information, check the source code in `src/features/realtime`, `src/features/notifications`, and `src/features/chat`.

