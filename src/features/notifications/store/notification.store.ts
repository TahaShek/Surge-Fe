// Notification Store using Zustand
import { create } from "zustand";
import type { Notification, NotificationState } from "../types/notification.types";
import { notificationApi, type SendUserNotificationRequest, type SendRoomNotificationRequest, type SendAnnouncementRequest, type SendBulkNotificationsRequest } from "../api/notification.api";

interface NotificationStore extends NotificationState {
  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  sendUserNotification: (request: SendUserNotificationRequest) => Promise<void>;
  sendRoomNotification: (request: SendRoomNotificationRequest) => Promise<void>;
  sendSystemAnnouncement: (request: SendAnnouncementRequest) => Promise<void>;
  sendBulkNotifications: (request: SendBulkNotificationsRequest) => Promise<void>;
  simulateScenario: (scenario: 'welcome' | 'security' | 'social' | 'system' | 'task') => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  addNotification: (notification) =>
    set((state) => {
      // Prevent duplicates
      if (state.notifications.some((n) => n.id === notification.id)) {
        return state;
      }

      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.read).length;

      // Show browser notification
      if (Notification.permission === "granted" && !notification.read) {
        new Notification(notification.title, {
          body: notification.message,
          icon: notification.metadata?.image || "/vite.svg",
          tag: notification.id,
        });
      }

      return {
        notifications: newNotifications,
        unreadCount,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // API Actions
  sendUserNotification: async (request) => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.sendUserNotification(request);
      
      if (response.success && response.data) {
        // Optionally add to local state if it's for the current user
        // set((state) => ({ 
        //   notifications: [response.data, ...state.notifications],
        //   loading: false 
        // }));
      }
      
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send notification';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  sendRoomNotification: async (request) => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.sendRoomNotification(request);
      
      if (response.success) {
        console.log(`Notification sent to ${response.data?.count || 0} users in room`);
      }
      
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send room notification';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  sendSystemAnnouncement: async (request) => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.sendSystemAnnouncement(request);
      
      if (response.success) {
        console.log(`System announcement sent to ${response.data?.count || 0} users`);
      }
      
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send system announcement';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  sendBulkNotifications: async (request) => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.sendBulkNotifications(request);
      
      if (response.success) {
        console.log(`Bulk notifications sent: ${response.data?.successCount || 0} succeeded, ${response.data?.failureCount || 0} failed`);
      }
      
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send bulk notifications';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  simulateScenario: async (scenario) => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.simulateScenario(scenario);
      
      if (response.success && response.data) {
        // Add simulated notifications to the store
        set((state) => ({
          notifications: [...response.data!, ...state.notifications],
          unreadCount: state.unreadCount + response.data!.filter(n => !n.read).length,
          loading: false,
        }));
      } else {
        set({ loading: false });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to simulate scenario';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const response = await notificationApi.getAnalytics();
      
      if (response.success) {
        console.log('Notification Analytics:', response.data);
        // You can store analytics in a separate state if needed
      }
      
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));

