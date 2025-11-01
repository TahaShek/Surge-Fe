// Chat Page - Full page chat interface
import React, { useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChatStore } from "../store/chat.store";
import { loadMockChatData } from "../mocks/mock-chat-data";

export const ChatPage: React.FC = () => {
  const { setRooms, setMessages } = useChatStore();

  // Load mock data on mount (replace with real API call)
  useEffect(() => {
    const mockData = loadMockChatData();
    setRooms(mockData.rooms);
    
    // Load messages for each room
    Object.entries(mockData.messages).forEach(([roomId, messages]) => {
      setMessages(roomId, messages);
    });
  }, [setRooms, setMessages]);

  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
};

