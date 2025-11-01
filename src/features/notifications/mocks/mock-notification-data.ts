// Mock Notification Data for Development/Testing
// Mock Notification Data for Development/Testing
import type { Notification } from "../types/notification.types";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "message",
    title: "New message from Alice",
    message: "Hey! Did you finish the project?",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      sender: {
        id: "user-1",
        name: "Alice Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      actionUrl: "/chat?room=room-1",
      actionLabel: "Reply",
    },
  },
  {
    id: "notif-2",
    type: "mention",
    title: "You were mentioned in Project Team",
    message: "@you Can you review the latest changes?",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      sender: {
        id: "user-2",
        name: "Bob Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
      actionUrl: "/chat?room=room-3",
      actionLabel: "View",
    },
  },
  {
    id: "notif-3",
    type: "success",
    title: "Deployment successful",
    message: "Your application has been deployed to production",
    read: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      actionUrl: "/deployments",
      actionLabel: "View deployment",
    },
  },
  {
    id: "notif-4",
    type: "info",
    title: "New feature available",
    message: "Check out the new real-time chat interface!",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      actionUrl: "/features",
      actionLabel: "Learn more",
    },
  },
  {
    id: "notif-5",
    type: "warning",
    title: "API rate limit warning",
    message: "You're approaching your API rate limit (80% used)",
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      actionUrl: "/settings/api",
      actionLabel: "View usage",
    },
  },
  {
    id: "notif-6",
    type: "message",
    title: "Diana sent you a message",
    message: "See you at the hackathon!",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "current-user",
    metadata: {
      sender: {
        id: "user-4",
        name: "Diana Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
      },
      actionUrl: "/chat?room=room-4",
      actionLabel: "Reply",
    },
  },
];

// Function to load mock notifications
export function loadMockNotifications() {
  return mockNotifications;
}

