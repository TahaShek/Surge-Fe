// Notification Hooks
import { useEffect, useCallback } from "react";
import { useSocketContext } from "../../realtime";
import { SOCKET_CONFIG } from "../../realtime/config/socket.config";
import { useNotificationStore } from "../store/notification.store";
import type { NotificationPayload } from "../types/notification.types";

export function useNotifications() {
  const { socket, connected, on, off, emit } = useSocketContext();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Handle new notifications from socket
  useEffect(() => {
    if (!connected || !socket) return;

    const handleNewNotification = (...args: unknown[]) => {
      const payload = args[0] as NotificationPayload;
      console.log("📩 New notification:", payload);
      addNotification(payload.notification);
    };

    on(SOCKET_CONFIG.events.NOTIFICATION_NEW, handleNewNotification);

    return () => {
      off(SOCKET_CONFIG.events.NOTIFICATION_NEW, handleNewNotification);
    };
  }, [connected, socket, on, off, addNotification]);

  // Mark notification as read (also emit to server)
  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsRead(id);
      if (connected) {
        emit(SOCKET_CONFIG.events.NOTIFICATION_READ, { notificationId: id });
      }
    },
    [markAsRead, emit, connected]
  );

  // Mark all as read (also emit to server)
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
    if (connected) {
      emit(SOCKET_CONFIG.events.NOTIFICATION_READ_ALL, {});
    }
  }, [markAllAsRead, emit, connected]);

  // Delete notification (also emit to server)
  const handleDeleteNotification = useCallback(
    (id: string) => {
      deleteNotification(id);
      if (connected) {
        emit(SOCKET_CONFIG.events.NOTIFICATION_DELETE, { notificationId: id });
      }
    },
    [deleteNotification, emit, connected]
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    clearAll,
    // API methods from store
    sendUserNotification: useNotificationStore.getState().sendUserNotification,
    sendRoomNotification: useNotificationStore.getState().sendRoomNotification,
    sendSystemAnnouncement: useNotificationStore.getState().sendSystemAnnouncement,
    sendBulkNotifications: useNotificationStore.getState().sendBulkNotifications,
    simulateScenario: useNotificationStore.getState().simulateScenario,
    fetchAnalytics: useNotificationStore.getState().fetchAnalytics,
  };
}

