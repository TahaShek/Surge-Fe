/**
 * Notification API Service
 * Handles all notification-related API calls to backend
 */

import { axios } from '@/lib/axios';
import type { Notification } from '../types/notification.types';

/**
 * API Response Types
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

/**
 * Request Types
 */
export interface SendUserNotificationRequest {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface SendRoomNotificationRequest {
  roomId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface SendAnnouncementRequest {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface SendBulkNotificationsRequest {
  notifications: SendUserNotificationRequest[];
  batchSize?: number;
  delayMs?: number;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalRead: number;
  totalUnread: number;
  byType: Record<string, number>;
  byUser: Record<string, number>;
  recentActivity: Array<{
    timestamp: string;
    action: string;
    count: number;
  }>;
}

/**
 * Notification API Endpoints
 */
const NOTIFICATION_ENDPOINTS = {
  USER: '/notifications/user',
  ROOM: '/notifications/room',
  ANNOUNCEMENT: '/notifications/announcement',
  BULK: '/notifications/bulk',
  SIMULATE: '/notifications/simulate',
  ANALYTICS: '/notifications/analytics',
} as const;

/**
 * Notification API Service Class
 */
class NotificationApiService {
  /**
   * Send notification to a specific user
   */
  async sendUserNotification(
    request: SendUserNotificationRequest
  ): Promise<ApiResponse<Notification>> {
    const response = await axios.post<ApiResponse<Notification>>(
      NOTIFICATION_ENDPOINTS.USER,
      request
    );
    return response.data;
  }

  /**
   * Send notification to all users in a room
   */
  async sendRoomNotification(
    request: SendRoomNotificationRequest
  ): Promise<ApiResponse<{ count: number; notifications: Notification[] }>> {
    const response = await axios.post<ApiResponse<{ count: number; notifications: Notification[] }>>
      (NOTIFICATION_ENDPOINTS.ROOM,
      request
    );
    return response.data;
  }

  /**
   * Send system-wide announcement
   */
  async sendSystemAnnouncement(
    request: SendAnnouncementRequest
  ): Promise<ApiResponse<{ count: number; notifications: Notification[] }>> {
    const response = await axios.post<ApiResponse<{ count: number; notifications: Notification[] }>>(
      NOTIFICATION_ENDPOINTS.ANNOUNCEMENT,
      request
    );
    return response.data;
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(
    request: SendBulkNotificationsRequest
  ): Promise<ApiResponse<{ successCount: number; failureCount: number }>> {
    const response = await axios.post<ApiResponse<{ successCount: number; failureCount: number }>>(
      NOTIFICATION_ENDPOINTS.BULK,
      request
    );
    return response.data;
  }

  /**
   * Simulate notification scenarios for demo
   * @param scenario - welcome, security, social, system, task
   */
  async simulateScenario(
    scenario: 'welcome' | 'security' | 'social' | 'system' | 'task'
  ): Promise<ApiResponse<Notification[]>> {
    const response = await axios.post<ApiResponse<Notification[]>>(
      `${NOTIFICATION_ENDPOINTS.SIMULATE}/${scenario}`
    );
    return response.data;
  }

  /**
   * Get notification analytics and statistics
   */
  async getAnalytics(): Promise<ApiResponse<NotificationAnalytics>> {
    const response = await axios.get<ApiResponse<NotificationAnalytics>>(
      NOTIFICATION_ENDPOINTS.ANALYTICS
    );
    return response.data;
  }
}

// Export singleton instance
export const notificationApi = new NotificationApiService();
