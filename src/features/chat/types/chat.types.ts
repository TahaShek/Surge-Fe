// Chat Types

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type?: "text" | "image" | "file" | "system";
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    imageUrl?: string;
    [key: string]: unknown;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "direct" | "group" | "channel";
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
}

export interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, Message[]>; // roomId -> messages
  activeRoomId: string | null;
  typingUsers: Record<string, TypingIndicator[]>; // roomId -> users typing
  onlineUsers: Set<string>;
  loading: boolean;
  error: string | null;
}

export interface MessagePayload {
  message: Message;
}

export interface TypingPayload {
  roomId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface UserStatusPayload {
  userId: string;
  status: "online" | "offline";
}

