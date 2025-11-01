// Notification Types

export type NotificationType = "info" | "success" | "warning" | "error" | "mention" | "message";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  metadata?: {
    actionUrl?: string;
    actionLabel?: string;
    image?: string;
    sender?: {
      id: string;
      name: string;
      avatar?: string;
    };
    [key: string]: unknown;
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface NotificationPayload {
  notification: Notification;
}

