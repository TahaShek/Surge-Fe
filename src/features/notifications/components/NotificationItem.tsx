// Notification Item Component
import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  MessageSquare,
  AtSign,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Notification, NotificationType } from "../types/notification.types";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationItemProps {
  notification: Notification;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  mention: <AtSign className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />,
};

const notificationColors: Record<NotificationType, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  mention: "text-purple-500",
  message: "text-primary",
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate to action URL if provided
    if (notification.metadata?.actionUrl) {
      window.location.href = notification.metadata.actionUrl;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-colors relative",
        !notification.read && "bg-accent/30"
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
      )}

      {/* Avatar or Icon */}
      <div className="flex-shrink-0 ml-2">
        {notification.metadata?.sender?.avatar ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.metadata.sender.avatar} />
            <AvatarFallback>
              {notification.metadata.sender.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center bg-accent",
              notificationColors[notification.type]
            )}
          >
            {notificationIcons[notification.type]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-sm line-clamp-1">{notification.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
          {notification.metadata?.actionLabel && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-primary font-medium">
                {notification.metadata.actionLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

