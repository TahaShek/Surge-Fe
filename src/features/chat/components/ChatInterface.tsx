// Main Chat Interface
import React from "react";
import { Card } from "@/components/ui/card";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "../hooks/useChat";

export const ChatInterface: React.FC = () => {
  const { activeRoomId } = useChat();

  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <Card className="h-full flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar />

        {/* Chat Window */}
        {activeRoomId ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

import { MessageSquare } from "lucide-react";

