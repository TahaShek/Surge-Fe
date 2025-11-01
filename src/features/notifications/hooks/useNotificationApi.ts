/**
 * Notification API Hook
 * Provides easy access to notification API operations
 */

import { useNotificationStore } from '../store/notification.store';
import type {
  SendUserNotificationRequest,
  SendRoomNotificationRequest,
  SendAnnouncementRequest,
  SendBulkNotificationsRequest,
} from '../api/notification.api';

export function useNotificationApi() {
  const {
    loading,
    error,
    sendUserNotification,
    sendRoomNotification,
    sendSystemAnnouncement,
    sendBulkNotifications,
    simulateScenario,
    fetchAnalytics,
  } = useNotificationStore();

  return {
    loading,
    error,
    
    /**
     * Send notification to a specific user
     */
    sendToUser: async (request: SendUserNotificationRequest) => {
      await sendUserNotification(request);
    },

    /**
     * Send notification to all users in a room
     */
    sendToRoom: async (request: SendRoomNotificationRequest) => {
      await sendRoomNotification(request);
    },

    /**
     * Send system-wide announcement to all users
     */
    sendAnnouncement: async (request: SendAnnouncementRequest) => {
      await sendSystemAnnouncement(request);
    },

    /**
     * Send bulk notifications
     */
    sendBulk: async (request: SendBulkNotificationsRequest) => {
      await sendBulkNotifications(request);
    },

    /**
     * Simulate notification scenarios for demo
     */
    simulate: async (scenario: 'welcome' | 'security' | 'social' | 'system' | 'task') => {
      await simulateScenario(scenario);
    },

    /**
     * Fetch notification analytics
     */
    getAnalytics: async () => {
      await fetchAnalytics();
    },
  };
}
