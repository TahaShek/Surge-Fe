// Chat feature exports
export { useChat } from "./hooks/useChat";
export { useChatStore } from "./store/chat.store";
export { ChatInterface } from "./components/ChatInterface";
export { ChatSidebar } from "./components/ChatSidebar";
export { ChatWindow } from "./components/ChatWindow";
export { ChatMessage } from "./components/ChatMessage";
export { ChatInput } from "./components/ChatInput";
export { ChatRoomItem } from "./components/ChatRoomItem";
export { TypingIndicator } from "./components/TypingIndicator";

export type {
  User,
  Message,
  ChatRoom,
  TypingIndicator as TypingIndicatorType,
  MessagePayload,
  TypingPayload,
  UserStatusPayload,
} from "./types/chat.types";

