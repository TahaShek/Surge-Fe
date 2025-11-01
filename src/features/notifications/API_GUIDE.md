# Notification API Integration Guide

This guide explains how to use the notification backend API in your frontend application.

## 📋 Overview

The notification system connects to your backend routes at `/api/notifications/*` and provides methods to:
- Send notifications to specific users
- Send notifications to rooms
- Broadcast system announcements
- Send bulk notifications
- Simulate notification scenarios
- Fetch analytics

## 🚀 Quick Start

### 1. Basic Usage with Hook

```tsx
import { useNotificationApi } from '@/features/notifications';

function MyComponent() {
  const { sendToUser, loading, error } = useNotificationApi();

  const handleSend = async () => {
    await sendToUser({
      userId: 'user123',
      type: 'info',
      title: 'Hello',
      message: 'This is a notification',
    });
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      Send Notification
    </button>
  );
}
```

### 2. Using the Store Directly

```tsx
import { useNotificationStore } from '@/features/notifications';

function MyComponent() {
  const sendUserNotification = useNotificationStore(
    (state) => state.sendUserNotification
  );

  const handleSend = async () => {
    await sendUserNotification({
      userId: 'user123',
      type: 'success',
      title: 'Success!',
      message: 'Operation completed',
    });
  };
}
```

### 3. Using the API Service Directly

```tsx
import { notificationApi } from '@/features/notifications';

async function sendNotification() {
  const response = await notificationApi.sendUserNotification({
    userId: 'user123',
    type: 'warning',
    title: 'Warning',
    message: 'Please review',
  });
  
  console.log(response);
}
```

## 📡 API Methods

### Send to User

Send a notification to a specific user by their ID.

```tsx
await sendToUser({
  userId: 'user123',
  type: 'info', // 'info' | 'success' | 'warning' | 'error' | 'mention' | 'message'
  title: 'New Message',
  message: 'You have a new message',
  data: {
    // Optional metadata
    actionUrl: '/messages/123',
    senderId: 'sender456',
  },
});
```

**Backend Route:** `POST /api/notifications/user`

### Send to Room

Send a notification to all users in a room/channel.

```tsx
await sendToRoom({
  roomId: 'room123',
  type: 'info',
  title: 'Room Update',
  message: 'New message in room',
  data: {
    roomName: 'General Chat',
  },
});
```

**Backend Route:** `POST /api/notifications/room`

### Send System Announcement

Broadcast a system-wide announcement to all connected users.

```tsx
await sendAnnouncement({
  type: 'info',
  title: 'System Maintenance',
  message: 'System will be down for maintenance at 2 AM',
  data: {
    priority: 'high',
    scheduledTime: '2025-11-01T02:00:00Z',
  },
});
```

**Backend Route:** `POST /api/notifications/announcement`

### Send Bulk Notifications

Send multiple notifications at once.

```tsx
await sendBulk({
  notifications: [
    {
      userId: 'user1',
      type: 'info',
      title: 'Notification 1',
      message: 'First notification',
    },
    {
      userId: 'user2',
      type: 'success',
      title: 'Notification 2',
      message: 'Second notification',
    },
  ],
  batchSize: 10, // Optional: send in batches
  delayMs: 100,  // Optional: delay between batches
});
```

**Backend Route:** `POST /api/notifications/bulk`

### Simulate Scenarios

Test different notification scenarios for demo/development.

```tsx
// Available scenarios: 'welcome', 'security', 'social', 'system', 'task'
await simulate('welcome');
await simulate('security');
await simulate('social');
```

**Backend Route:** `POST /api/notifications/simulate/:scenario`

### Get Analytics

Fetch notification statistics and analytics.

```tsx
await getAnalytics();
// Check console for analytics data
```

**Backend Route:** `GET /api/notifications/analytics`

## 🎯 Complete Example Component

```tsx
import { useState } from 'react';
import { useNotificationApi } from '@/features/notifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NotificationSender() {
  const { sendToUser, sendAnnouncement, simulate, loading } = useNotificationApi();
  const [userId, setUserId] = useState('');

  const handleSendToUser = async () => {
    try {
      await sendToUser({
        userId,
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test message',
      });
      toast.success('Notification sent!');
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const handleBroadcast = async () => {
    try {
      await sendAnnouncement({
        type: 'info',
        title: 'System Update',
        message: 'New features available!',
      });
      toast.success('Announcement sent!');
    } catch (error) {
      toast.error('Failed to send announcement');
    }
  };

  const handleDemo = async () => {
    try {
      await simulate('welcome');
      toast.success('Demo notifications added!');
    } catch (error) {
      toast.error('Failed to simulate');
    }
  };

  return (
    <div className="space-y-4">
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        className="border rounded px-3 py-2"
      />
      
      <div className="flex gap-2">
        <Button onClick={handleSendToUser} disabled={loading}>
          Send to User
        </Button>
        <Button onClick={handleBroadcast} disabled={loading}>
          Broadcast
        </Button>
        <Button onClick={handleDemo} disabled={loading}>
          Demo
        </Button>
      </div>
    </div>
  );
}
```

## 🎨 Demo Component

Try the pre-built demo component:

```tsx
import { NotificationApiDemo } from '@/features/notifications/components/NotificationApiDemo';

function App() {
  return <NotificationApiDemo />;
}
```

## 🔧 Configuration

Make sure your axios instance is configured with the correct backend URL:

```ts
// src/lib/axios/axios.config.ts
export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api', // Your backend URL
  timeout: 10000,
};
```

## 📦 Type Definitions

### SendUserNotificationRequest
```typescript
{
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
```

### SendRoomNotificationRequest
```typescript
{
  roomId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
```

### SendAnnouncementRequest
```typescript
{
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
```

## 🐛 Error Handling

All methods handle errors and update the store's error state:

```tsx
const { error } = useNotificationApi();

if (error) {
  console.error('Notification error:', error);
}
```

## 🚦 Loading States

Track loading state for UI feedback:

```tsx
const { loading } = useNotificationApi();

<Button disabled={loading}>
  {loading ? 'Sending...' : 'Send'}
</Button>
```

## 📝 Notes

- All API calls are asynchronous and return Promises
- Errors are caught and stored in the notification store
- Real-time notifications still work via Socket.IO
- API methods are for triggering notifications from the frontend
- The backend must be running for API calls to work

## 🔗 Related Documentation

- [Notification Store](../store/notification.store.ts)
- [Notification Types](../types/notification.types.ts)
- [Real-time Notifications](./REALTIME.md)
