# Notification Backend Integration - Quick Reference

## ✅ What's Been Created

### 1. API Service (`api/notification.api.ts`)
- `notificationApi.sendUserNotification()` - Send to specific user
- `notificationApi.sendRoomNotification()` - Send to room
- `notificationApi.sendSystemAnnouncement()` - Broadcast to all
- `notificationApi.sendBulkNotifications()` - Send multiple
- `notificationApi.simulateScenario()` - Demo scenarios
- `notificationApi.getAnalytics()` - Fetch stats

### 2. Updated Store (`store/notification.store.ts`)
Added API methods to Zustand store with loading/error states

### 3. New Hook (`hooks/useNotificationApi.ts`)
Convenient hook for accessing API methods

### 4. Demo Component (`components/NotificationApiDemo.tsx`)
Interactive UI to test all API endpoints

### 5. Documentation (`API_GUIDE.md`)
Complete guide with examples

## 🚀 Quick Usage

```tsx
import { useNotificationApi } from '@/features/notifications';

function MyComponent() {
  const { sendToUser } = useNotificationApi();

  const handleClick = async () => {
    await sendToUser({
      userId: 'user123',
      type: 'info',
      title: 'Hello',
      message: 'This is a notification',
    });
  };

  return <button onClick={handleClick}>Send</button>;
}
```

## 📡 Backend Routes Mapped

| Frontend Method | Backend Route | Description |
|----------------|---------------|-------------|
| `sendToUser()` | `POST /api/notifications/user` | Send to specific user |
| `sendToRoom()` | `POST /api/notifications/room` | Send to room |
| `sendAnnouncement()` | `POST /api/notifications/announcement` | Broadcast to all |
| `sendBulk()` | `POST /api/notifications/bulk` | Send multiple |
| `simulate()` | `POST /api/notifications/simulate/:scenario` | Demo scenarios |
| `getAnalytics()` | `GET /api/notifications/analytics` | Get statistics |

## 🎯 Testing

Use the demo component to test:

```tsx
import { NotificationApiDemo } from '@/features/notifications/components/NotificationApiDemo';

function TestPage() {
  return <NotificationApiDemo />;
}
```

## ⚙️ Configuration

Ensure your backend URL is set correctly in `src/lib/axios/axios.config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api', // Your backend URL
};
```

## 📦 Exports Available

```typescript
import {
  // Hooks
  useNotificationApi,
  useNotifications,
  
  // API Service
  notificationApi,
  
  // Types
  SendUserNotificationRequest,
  SendRoomNotificationRequest,
  SendAnnouncementRequest,
  SendBulkNotificationsRequest,
  NotificationAnalytics,
} from '@/features/notifications';
```

## 🎨 Example: Send Welcome Notification

```tsx
import { useNotificationApi } from '@/features/notifications';
import { useEffect } from 'react';

function WelcomeUser({ userId }: { userId: string }) {
  const { sendToUser } = useNotificationApi();

  useEffect(() => {
    // Send welcome notification when user logs in
    sendToUser({
      userId,
      type: 'success',
      title: 'Welcome!',
      message: 'Thanks for joining our platform',
      data: {
        actionUrl: '/onboarding',
        actionLabel: 'Get Started',
      },
    });
  }, [userId, sendToUser]);

  return null;
}
```

## 🎯 Example: Simulate Demo Scenarios

```tsx
import { useNotificationApi } from '@/features/notifications';

function DemoButton() {
  const { simulate } = useNotificationApi();

  return (
    <div>
      <button onClick={() => simulate('welcome')}>Welcome Demo</button>
      <button onClick={() => simulate('security')}>Security Demo</button>
      <button onClick={() => simulate('social')}>Social Demo</button>
      <button onClick={() => simulate('system')}>System Demo</button>
      <button onClick={() => simulate('task')}>Task Demo</button>
    </div>
  );
}
```

## 🔍 What Each Scenario Does

- **welcome**: Simulates welcome messages for new users
- **security**: Simulates security alerts and warnings
- **social**: Simulates social interactions (likes, follows, mentions)
- **system**: Simulates system updates and maintenance notices
- **task**: Simulates task assignments and reminders

## ✨ All Set!

Your frontend is now fully connected to the backend notification routes. Test it using the `NotificationApiDemo` component!
