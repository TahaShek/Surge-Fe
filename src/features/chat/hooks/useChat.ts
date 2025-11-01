// Chat Hooks
import { useEffect, useCallback, useRef } from "react";
import { useSocketContext } from "../../realtime";
import { SOCKET_CONFIG } from "../../realtime/config/socket.config";
import { useChatStore } from "../store/chat.store";
import type {
    MessagePayload,
    TypingPayload,
    UserStatusPayload,
    Message,
} from "../types/chat.types";

export function useChat() {
  const { socket, connected, on, off, emit } = useSocketContext();
  const {
    rooms,
    messages,
    activeRoomId,
    typingUsers,
    onlineUsers,
    addMessage,
    setUserTyping,
    removeUserTyping,
    setUserOnline,
    setUserOffline,
    markMessagesAsRead,
    setActiveRoom,
  } = useChatStore();

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle incoming messages
  useEffect(() => {
    if (!connected || !socket) return;

    const handleNewMessage = (...args: unknown[]) => {
      const payload = args[0] as MessagePayload;
      console.log("💬 New message:", payload);
      addMessage(payload.message);
    };

    const handleTyping = (...args: unknown[]) => {
      const payload = args[0] as TypingPayload;
      if (payload.isTyping) {
        setUserTyping(payload.roomId, payload.userId, payload.userName);
      } else {
        removeUserTyping(payload.roomId, payload.userId);
      }
    };

    const handleUserOnline = (...args: unknown[]) => {
      const payload = args[0] as UserStatusPayload;
      setUserOnline(payload.userId);
    };

    const handleUserOffline = (...args: unknown[]) => {
      const payload = args[0] as UserStatusPayload;
      setUserOffline(payload.userId);
    };

    on(SOCKET_CONFIG.events.CHAT_MESSAGE, handleNewMessage);
    on(SOCKET_CONFIG.events.CHAT_TYPING, handleTyping);
    on(SOCKET_CONFIG.events.CHAT_USER_ONLINE, handleUserOnline);
    on(SOCKET_CONFIG.events.CHAT_USER_OFFLINE, handleUserOffline);

    return () => {
      off(SOCKET_CONFIG.events.CHAT_MESSAGE, handleNewMessage);
      off(SOCKET_CONFIG.events.CHAT_TYPING, handleTyping);
      off(SOCKET_CONFIG.events.CHAT_USER_ONLINE, handleUserOnline);
      off(SOCKET_CONFIG.events.CHAT_USER_OFFLINE, handleUserOffline);
    };
  }, [
    connected,
    socket,
    on,
    off,
    addMessage,
    setUserTyping,
    removeUserTyping,
    setUserOnline,
    setUserOffline,
  ]);

  // Join room when active room changes
  useEffect(() => {
    if (activeRoomId && connected) {
      emit(SOCKET_CONFIG.events.CHAT_JOIN_ROOM, { roomId: activeRoomId });
      markMessagesAsRead(activeRoomId);

      return () => {
        emit(SOCKET_CONFIG.events.CHAT_LEAVE_ROOM, { roomId: activeRoomId });
      };
    }
  }, [activeRoomId, connected, emit, markMessagesAsRead]);

  // Send message
  const sendMessage = useCallback(
    (roomId: string, content: string) => {
      if (!connected) {
        console.warn("⚠️ Cannot send message: Not connected");
        return;
      }

      const message: Partial<Message> = {
        roomId,
        content,
        timestamp: new Date().toISOString(),
        type: "text",
      };

      emit(SOCKET_CONFIG.events.CHAT_MESSAGE, message);
    },
    [connected, emit]
  );

  // Send typing indicator
  const sendTyping = useCallback(
    (roomId: string, isTyping: boolean) => {
      if (!connected) return;

      emit(SOCKET_CONFIG.events.CHAT_TYPING, { roomId, isTyping });
    },
    [connected, emit]
  );

  // Handle typing with auto-stop
  const handleTyping = useCallback(
    (roomId: string) => {
      sendTyping(roomId, true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(roomId, false);
      }, 3000);
    },
    [sendTyping]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    (roomId: string) => {
      markMessagesAsRead(roomId);
      if (connected) {
        emit(SOCKET_CONFIG.events.CHAT_MESSAGE_READ, { roomId });
      }
    },
    [markMessagesAsRead, connected, emit]
  );

  // Get active room data
  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeTypingUsers = activeRoomId ? typingUsers[activeRoomId] || [] : [];

  return {
    rooms,
    messages,
    activeRoomId,
    activeRoom,
    activeMessages,
    activeTypingUsers,
    onlineUsers,
    connected,
    sendMessage,
    handleTyping,
    markAsRead,
    setActiveRoom,
  };
}

