// Chat Message Component
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "../types/chat.types";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

// Get current user ID from auth (mock for now)
const getCurrentUserId = () => localStorage.getItem("userId") || "current-user";

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showAvatar = true,
}) => {
  const isOwnMessage = message.senderId === getCurrentUserId();

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isOwnMessage && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.senderAvatar} />
            <AvatarFallback>
              {message.senderName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isOwnMessage && "items-end"
        )}
      >
        {showAvatar && !isOwnMessage && (
          <span className="text-xs font-medium text-muted-foreground px-3">
            {message.senderName}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
          )}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        <span className="text-xs text-muted-foreground px-3">
          {format(new Date(message.timestamp), "HH:mm")}
        </span>
      </div>
    </div>
  );
};

