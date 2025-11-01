// Chat Sidebar Component
import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChat } from "../hooks/useChat";
import { ChatRoomItem } from "./ChatRoomItem";

export const ChatSidebar: React.FC = () => {
  const { rooms } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r flex flex-col">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Room List */}
      <ScrollArea className="flex-1">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredRooms.map((room) => (
              <ChatRoomItem key={room.id} room={room} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

