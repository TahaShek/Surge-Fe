// Chat Store using Zustand
import { create } from "zustand";
import type { ChatState, ChatRoom, Message } from "../types/chat.types";

interface ChatStore extends ChatState {
  // Room actions
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  setActiveRoom: (roomId: string | null) => void;

  // Message actions
  addMessage: (message: Message) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
  markMessagesAsRead: (roomId: string) => void;

  // Typing actions
  setUserTyping: (roomId: string, userId: string, userName: string) => void;
  removeUserTyping: (roomId: string, userId: string) => void;

  // User status actions
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  typingUsers: {},
  onlineUsers: new Set(),
  loading: false,
  error: null,

  // Room actions
  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) =>
    set((state) => ({
      rooms: [room, ...state.rooms.filter((r) => r.id !== room.id)],
    })),

  updateRoom: (roomId, updates) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room
      ),
    })),

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  // Message actions
  addMessage: (message) =>
    set((state) => {
      const roomMessages = state.messages[message.roomId] || [];
      
      // Prevent duplicates
      if (roomMessages.some((m) => m.id === message.id)) {
        return state;
      }

      const newMessages = {
        ...state.messages,
        [message.roomId]: [...roomMessages, message],
      };

      // Update room's last message and unread count
      const updatedRooms = state.rooms.map((room) => {
        if (room.id === message.roomId) {
          const isActiveRoom = state.activeRoomId === message.roomId;
          return {
            ...room,
            lastMessage: message,
            unreadCount: isActiveRoom ? room.unreadCount : room.unreadCount + 1,
            updatedAt: message.timestamp,
          };
        }
        return room;
      });

      return {
        messages: newMessages,
        rooms: updatedRooms,
      };
    }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages,
      },
    })),

  markMessagesAsRead: (roomId) =>
    set((state) => {
      const roomMessages = state.messages[roomId] || [];
      const updatedMessages = {
        ...state.messages,
        [roomId]: roomMessages.map((msg) => ({ ...msg, read: true })),
      };

      const updatedRooms = state.rooms.map((room) =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      );

      return {
        messages: updatedMessages,
        rooms: updatedRooms,
      };
    }),

  // Typing actions
  setUserTyping: (roomId, userId, userName) =>
    set((state) => {
      const currentTyping = state.typingUsers[roomId] || [];
      if (currentTyping.some((t) => t.userId === userId)) {
        return state;
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [roomId]: [...currentTyping, { roomId, userId, userName }],
        },
      };
    }),

  removeUserTyping: (roomId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [roomId]: (state.typingUsers[roomId] || []).filter(
          (t) => t.userId !== userId
        ),
      },
    })),

  // User status actions
  setUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),

  setUserOffline: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),

  // Utility actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

