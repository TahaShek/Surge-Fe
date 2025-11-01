// Socket.IO Configuration
// Socket.IO Configuration
import type { ManagerOptions, SocketOptions } from "socket.io-client";

export const SOCKET_CONFIG = {
  // Base URL for socket connection
  url: import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:4000",
  
  // Socket.IO connection options
  options: {
    transports: ["websocket", "polling"], // Fallback to polling if websocket fails
    autoConnect: false, // Manual connection control
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
    forceNew: false,
    multiplex: true,
  } as Partial<ManagerOptions & SocketOptions>,

  // Event names
  events: {
    // Connection events
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CONNECT_ERROR: "connect_error",
    RECONNECT: "reconnect",
    RECONNECT_ATTEMPT: "reconnect_attempt",
    RECONNECT_ERROR: "reconnect_error",
    RECONNECT_FAILED: "reconnect_failed",

    // Notification events
    NOTIFICATION_NEW: "notification:new",
    NOTIFICATION_READ: "notification:read",
    NOTIFICATION_READ_ALL: "notification:read_all",
    NOTIFICATION_DELETE: "notification:delete",

    // Chat events
    CHAT_MESSAGE: "chat:message",
    CHAT_TYPING: "chat:typing",
    CHAT_STOP_TYPING: "chat:stop_typing",
    CHAT_MESSAGE_READ: "chat:message:read",
    CHAT_JOIN_ROOM: "chat:join_room",
    CHAT_LEAVE_ROOM: "chat:leave_room",
    CHAT_USER_ONLINE: "chat:user:online",
    CHAT_USER_OFFLINE: "chat:user:offline",

    // Presence events
    USER_ONLINE: "user:online",
    USER_OFFLINE: "user:offline",
    USER_STATUS: "user:status",

    // Generic events
    ERROR: "error",
    SUCCESS: "success",
  } as const,
} as const;

export type SocketEvent = typeof SOCKET_CONFIG.events[keyof typeof SOCKET_CONFIG.events];

