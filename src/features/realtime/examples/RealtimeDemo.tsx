// Real-time Features Demo Page
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSocketContext } from "../context/SocketProvider";
import { useNotificationStore } from "@/features/notifications/store/notification.store";
import { useChatStore } from "@/features/chat/store/chat.store";
import { loadMockNotifications } from "@/features/notifications/mocks/mock-notification-data";
import { loadMockChatData } from "@/features/chat/mocks/mock-chat-data";
import type { Notification } from "@/features/notifications/types/notification.types";
import type { Message } from "@/features/chat/types/chat.types";

export const RealtimeDemo: React.FC = () => {
  const { socket, connected, connecting, error, connect, disconnect, emit } = useSocketContext();
  const [eventLog, setEventLog] = useState<string[]>([]);
  const { setNotifications, addNotification } = useNotificationStore();
  const { setRooms, setMessages } = useChatStore();

  // Load mock data
  const handleLoadMockData = () => {
    const mockNotifications = loadMockNotifications();
    setNotifications(mockNotifications);

    const mockChatData = loadMockChatData();
    setRooms(mockChatData.rooms);
    Object.entries(mockChatData.messages).forEach(([roomId, messages]) => {
      setMessages(roomId, messages);
    });

    addLog("Loaded mock data");
  };

  const addLog = (message: string) => {
    setEventLog(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    if (connected) {
      addLog("✅ Connected to socket server");
    } else if (connecting) {
      addLog("🔄 Connecting...");
    } else if (error) {
      addLog(`❌ Error: ${error}`);
    }
  }, [connected, connecting, error]);

  // Test functions
  const testNotification = () => {
    const mockNotif: Notification = {
      id: `test-${Date.now()}`,
      type: "info",
      title: "Test Notification",
      message: "This is a test notification from the demo",
      read: false,
      createdAt: new Date().toISOString(),
      userId: "current-user",
    };
    addNotification(mockNotif);
    addLog("📩 Added test notification");
  };

  const testSocketEmit = () => {
    if (connected) {
      emit("test:event", { message: "Hello from demo!" });
      addLog("📤 Emitted test event");
    } else {
      addLog("⚠️ Not connected, cannot emit");
    }
  };

  const testChatMessage = () => {
    const mockMessage: Message = {
      id: `msg-${Date.now()}`,
      roomId: "room-1",
      senderId: "current-user",
      senderName: "You",
      content: "This is a test message!",
      timestamp: new Date().toISOString(),
      read: true,
      type: "text",
    };
    
    const currentMessages = useChatStore.getState().messages["room-1"] || [];
    setMessages("room-1", [...currentMessages, mockMessage]);
    addLog("💬 Added test chat message");
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Real-time Features Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test and explore Socket.IO integration, notifications, and chat features
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Socket.IO Connection Status
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? "Connected" : connecting ? "Connecting..." : "Disconnected"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time connection to the backend server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={connect} disabled={connected || connecting}>
              Connect
            </Button>
            <Button onClick={disconnect} disabled={!connected} variant="outline">
              Disconnect
            </Button>
          </div>

          {socket && (
            <div className="space-y-2 text-sm">
              <p><strong>Socket ID:</strong> {socket.id || "N/A"}</p>
              <p><strong>Status:</strong> {connected ? "🟢 Active" : "🔴 Inactive"}</p>
              {error && <p className="text-destructive"><strong>Error:</strong> {error}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>
            Try out different real-time features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="socket">Socket Events</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test notification features
              </p>
              <div className="flex gap-2">
                <Button onClick={testNotification}>
                  Add Test Notification
                </Button>
                <Button onClick={handleLoadMockData} variant="outline">
                  Load Mock Data
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Check the notification bell in the navbar to see new notifications
              </p>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test chat features
              </p>
              <div className="flex gap-2">
                <Button onClick={testChatMessage}>
                  Add Test Message
                </Button>
                <Button onClick={() => window.location.href = "/chat"} variant="outline">
                  Open Chat Page
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Visit /chat to see the full chat interface
              </p>
            </TabsContent>

            <TabsContent value="socket" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test socket.io events
              </p>
              <div className="flex gap-2">
                <Button onClick={testSocketEmit} disabled={!connected}>
                  Emit Test Event
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Socket must be connected to emit events
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Log */}
      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>
            Real-time event activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto font-mono text-sm space-y-1">
            {eventLog.length === 0 ? (
              <p className="text-muted-foreground">No events yet...</p>
            ) : (
              eventLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="link" className="p-0 h-auto" onClick={() => window.location.href = "/chat"}>
            → Open Chat Interface
          </Button>
          <Button variant="link" className="p-0 h-auto" onClick={() => window.location.href = "/notifications"}>
            → Open Notification Center
          </Button>
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="/docs/features/REALTIME.md" target="_blank">
              → View Documentation
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Code Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Use Notifications</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`import { useNotifications } from "@/features/notifications";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title}
        </div>
      ))}
    </div>
  );
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Chat</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`import { useChat } from "@/features/chat";

function MyChat() {
  const { activeRoom, sendMessage } = useChat();
  
  const handleSend = (message: string) => {
    if (activeRoom) {
      sendMessage(activeRoom.id, message);
    }
  };
  
  return <ChatInterface />;
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Custom Socket Events</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`import { useSocketContext } from "@/features/realtime";

function MyComponent() {
  const { on, off, emit, connected } = useSocketContext();

  useEffect(() => {
    if (!connected) return;
    
    const handler = (data) => console.log(data);
    on("custom:event", handler);
    
    return () => off("custom:event", handler);
  }, [connected, on, off]);

  const sendEvent = () => emit("custom:event", { data: "hello" });
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

