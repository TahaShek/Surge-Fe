// Chat Input Component
import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "../hooks/useChat";

export const ChatInput: React.FC = () => {
  const { activeRoomId, sendMessage, handleTyping } = useChat();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeRoomId) return;

    sendMessage(activeRoomId, message.trim());
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    if (activeRoomId && e.target.value) {
      handleTyping(activeRoomId);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-end gap-2">
        {/* Attachment buttons */}
        <div className="flex items-center gap-1 mb-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

        {/* Send/Voice button */}
        {message.trim() ? (
          <Button type="submit" size="icon" className="mb-2 flex-shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="icon" className="mb-2 flex-shrink-0">
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>
    </form>
  );
};

