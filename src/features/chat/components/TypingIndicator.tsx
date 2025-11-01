// Typing Indicator Component
import React from "react";
import type { TypingIndicator as TypingIndicatorType } from "../types/chat.types";

interface TypingIndicatorProps {
  users: TypingIndicatorType[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (users.length === 0) return null;

  const names = users.map((u) => u.userName).join(", ");
  const text =
    users.length === 1
      ? `${names} is typing...`
      : `${names} are typing...`;

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
      <span>{text}</span>
    </div>
  );
};

