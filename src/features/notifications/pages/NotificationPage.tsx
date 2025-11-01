// Notification Page - Full page notification center
import React, { useEffect } from "react";
import { NotificationCenter } from "../components/NotificationCenter";
import { useNotificationStore } from "../store/notification.store";
import { loadMockNotifications } from "../mocks/mock-notification-data";

export const NotificationPage: React.FC = () => {
  const { setNotifications } = useNotificationStore();

  // Load mock data on mount (replace with real API call)
  useEffect(() => {
    const mockNotifications = loadMockNotifications();
    setNotifications(mockNotifications);
  }, [setNotifications]);

  return <NotificationCenter />;
};

