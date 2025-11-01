# 🧪 Testing the Notification API Demo

## ✅ Setup Complete!

The Notification API Demo has been added to your routes at:
```
/notifications/demo
```

## 🚀 How to Test

### Method 1: Direct URL Navigation

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Login to your application** using one of these test accounts:
   - Admin: `admin@example.com` / `admin123`
   - User: `user@example.com` / `user123`
   - Guest: `guest@example.com` / `guest123`

3. **Navigate to the demo page** by entering this URL in your browser:
   ```
   http://localhost:5173/notifications/demo
   ```

### Method 2: Add a Navigation Link (Optional)

You can add a quick link in your sidebar or navbar. Here's an example:

```tsx
// In your Sidebar.tsx, add this to navigationItems array:
{
  title: "Notification Demo",
  href: "/notifications/demo",
  icon: Bell, // or any icon you prefer
  subject: 'Notifications' as Subjects,
}
```

### Method 3: Direct Navigation in Code

In any component, you can navigate programmatically:

```tsx
import { useNavigate } from 'react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/notifications/demo')}>
      Test Notifications
    </button>
  );
}
```

## 🎯 What You Can Test

### 1. **Send to User**
   - Enter a user ID (e.g., `user123`)
   - Click "Send to User"
   - Backend will send notification to that specific user

### 2. **Send to Room**
   - Enter a room ID (e.g., `room123`)
   - Click "Send to Room"
   - Backend will send notification to all users in that room

### 3. **System Announcement**
   - Click "Send Announcement"
   - Backend will broadcast to all connected users

### 4. **Simulate Scenarios**
   - Click any scenario button (Welcome, Security, Social, System, Task)
   - Pre-configured notifications will be created
   - Great for testing UI without real data

### 5. **Get Analytics**
   - Click "Get Analytics"
   - Check browser console for analytics data
   - Shows notification statistics from backend

## 🔧 Backend Requirements

Make sure your backend is running and accessible at the URL configured in:
```
src/lib/axios/axios.config.ts
```

Default: `http://localhost:3000/api`

## 📝 Example Test Flow

1. **Start backend server** (make sure it's running on port 3000)
2. **Start frontend**: `npm run dev`
3. **Login** with `admin@example.com` / `admin123`
4. **Navigate** to `http://localhost:5173/notifications/demo`
5. **Click "Welcome"** in Simulate Scenarios section
6. **See notifications** appear in your notification bell (top right)
7. **Try other buttons** to test different API endpoints

## 🐛 Troubleshooting

### Issue: Can't access `/notifications/demo`
- **Solution**: Make sure you're logged in and have Notifications permission

### Issue: API calls fail
- **Solution**: Check your backend is running and the API URL is correct in `axios.config.ts`

### Issue: No notifications appear
- **Solution**: 
  1. Check browser console for errors
  2. Verify Socket.IO connection is active
  3. Make sure backend notification routes are working

### Issue: 403 Forbidden
- **Solution**: Login with a user that has Notifications permission (admin or user role)

## 🎨 Demo Component Features

The demo page includes:
- ✅ User-specific notifications
- ✅ Room/group notifications  
- ✅ System-wide announcements
- ✅ Bulk notification sending
- ✅ Pre-configured scenario simulations
- ✅ Analytics dashboard access
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications for feedback

## 📖 Next Steps

After testing the demo:

1. **Integrate in your components**: Use `useNotificationApi()` hook
2. **Customize notifications**: Add your own notification types
3. **Add business logic**: Send notifications based on user actions
4. **Monitor analytics**: Track notification engagement

## 💡 Quick Code Example

```tsx
import { useNotificationApi } from '@/features/notifications';
import { useEffect } from 'react';

function WelcomeUser({ userId }: { userId: string }) {
  const { sendToUser } = useNotificationApi();

  useEffect(() => {
    // Send welcome notification when component mounts
    sendToUser({
      userId,
      type: 'success',
      title: 'Welcome!',
      message: 'Thanks for joining our platform',
      data: {
        actionUrl: '/dashboard',
        actionLabel: 'Get Started',
      },
    });
  }, [userId, sendToUser]);

  return null;
}
```

Happy testing! 🚀
