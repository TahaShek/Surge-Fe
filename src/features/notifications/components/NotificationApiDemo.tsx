/**
 * Notification API Demo Component
 * Demonstrates how to use the notification API
 */

import { useState } from 'react';
import { useNotificationApi } from '../hooks/useNotificationApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function NotificationApiDemo() {
  const {
    sendToUser,
    sendToRoom,
    sendAnnouncement,
    simulate,
    getAnalytics,
    loading,
    error,
  } = useNotificationApi();

  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSendToUser = async () => {
    if (!userId) {
      toast.error('Please enter a user ID');
      return;
    }

    try {
      await sendToUser({
        userId,
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification sent to a specific user',
        data: { timestamp: new Date().toISOString() },
      });
      toast.success('Notification sent to user');
    } catch {
      toast.error('Failed to send notification');
    }
  };

  const handleSendToRoom = async () => {
    if (!roomId) {
      toast.error('Please enter a room ID');
      return;
    }

    try {
      await sendToRoom({
        roomId,
        type: 'info',
        title: 'Room Notification',
        message: 'This notification is sent to all users in the room',
        data: { room: roomId },
      });
      toast.success('Notification sent to room');
    } catch {
      toast.error('Failed to send room notification');
    }
  };

  const handleSendAnnouncement = async () => {
    try {
      await sendAnnouncement({
        type: 'info',
        title: 'System Announcement',
        message: 'This is a system-wide announcement to all connected users',
        data: { priority: 'high' },
      });
      toast.success('System announcement sent');
    } catch {
      toast.error('Failed to send announcement');
    }
  };

  const handleSimulate = async (scenario: 'welcome' | 'security' | 'social' | 'system' | 'task') => {
    try {
      await simulate(scenario);
      toast.success(`Simulated ${scenario} scenario`);
    } catch {
      toast.error('Failed to simulate scenario');
    }
  };

  const handleGetAnalytics = async () => {
    try {
      await getAnalytics();
      toast.success('Analytics fetched (check console)');
    } catch {
      toast.error('Failed to fetch analytics');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Notification API Demo</h2>
        <p className="text-muted-foreground">Test the notification backend API integration</p>
      </div>

      {error && (
        <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-950 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Send to User */}
        <Card>
          <CardHeader>
            <CardTitle>Send to User</CardTitle>
            <CardDescription>Send a notification to a specific user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <Button onClick={handleSendToUser} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send to User'}
            </Button>
          </CardContent>
        </Card>

        {/* Send to Room */}
        <Card>
          <CardHeader>
            <CardTitle>Send to Room</CardTitle>
            <CardDescription>Send a notification to all users in a room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <Button onClick={handleSendToRoom} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send to Room'}
            </Button>
          </CardContent>
        </Card>

        {/* System Announcement */}
        <Card>
          <CardHeader>
            <CardTitle>System Announcement</CardTitle>
            <CardDescription>Broadcast to all connected users</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSendAnnouncement} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Announcement'}
            </Button>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Fetch notification statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetAnalytics} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Get Analytics'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Simulate Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Simulate Scenarios</CardTitle>
          <CardDescription>Test different notification scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
            <Button
              variant="outline"
              onClick={() => handleSimulate('welcome')}
              disabled={loading}
            >
              Welcome
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSimulate('security')}
              disabled={loading}
            >
              Security
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSimulate('social')}
              disabled={loading}
            >
              Social
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSimulate('system')}
              disabled={loading}
            >
              System
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSimulate('task')}
              disabled={loading}
            >
              Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
