/**
 * Example: Notification Demo Page
 * Shows how to integrate NotificationApiDemo in your app
 */

import { NotificationApiDemo } from '@/features/notifications';

export function NotificationTestPage() {
  return (
    <div className="container mx-auto py-8">
      <NotificationApiDemo />
    </div>
  );
}

// Add this to your routes:
// {
//   path: '/notifications/demo',
//   element: <NotificationTestPage />,
// }
