// Chat Window Component
import React, { useEffect, useRef } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

export const ChatWindow: React.FC = () => {
  const { activeRoom, activeMessages, activeTypingUsers, onlineUsers } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  if (!activeRoom) return null;

  const isOnline =
    activeRoom.type === "direct" &&
    activeRoom.participants.some((p) => onlineUsers.has(p.id));

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activeRoom.avatar} />
              <AvatarFallback>{activeRoom.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{activeRoom.name}</h3>
            <p className="text-xs text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {activeMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          ) : (
            <>
              {activeMessages.map((message, index) => {
                const prevMessage = activeMessages[index - 1];
                const showAvatar =
                  !prevMessage || prevMessage.senderId !== message.senderId;

                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {activeTypingUsers.length > 0 && (
          <TypingIndicator users={activeTypingUsers} />
        )}
      </ScrollArea>

      <Separator />

      {/* Input */}
      <ChatInput />
    </div>
  );
};

