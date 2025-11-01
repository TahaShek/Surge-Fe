// Chat Room Item Component
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ChatRoom } from "../types/chat.types";
import { useChat } from "../hooks/useChat";

interface ChatRoomItemProps {
  room: ChatRoom;
}

export const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ room }) => {
  const { activeRoomId, setActiveRoom, onlineUsers } = useChat();
  const isActive = activeRoomId === room.id;

  // For direct messages, check if the other user is online
  const isOnline =
    room.type === "direct" &&
    room.participants.some((p) => onlineUsers.has(p.id));

  const handleClick = () => {
    setActiveRoom(room.id);
  };

  return (
    <div
      className={cn(
        "p-4 hover:bg-accent cursor-pointer transition-colors",
        isActive && "bg-accent"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={room.avatar} />
            <AvatarFallback>{room.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate">{room.name}</h3>
            {room.lastMessage && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatDistanceToNow(new Date(room.lastMessage.timestamp), {
                  addSuffix: false,
                })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-sm text-muted-foreground truncate">
              {room.lastMessage?.content || "No messages yet"}
            </p>
            {room.unreadCount > 0 && (
              <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center px-1.5">
                {room.unreadCount > 9 ? "9+" : room.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

