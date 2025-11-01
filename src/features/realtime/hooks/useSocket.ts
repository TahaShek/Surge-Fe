import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState, useCallback } from "react";
import { SOCKET_CONFIG } from "../config/socket.config";
import type { ConnectionStatus } from "../types";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  useEffect(() => {
    // Get auth token from storage
    const token = localStorage.getItem("accessToken");

    // Initialize socket connection
    const socket = io(SOCKET_CONFIG.url, {
      ...SOCKET_CONFIG.options,
      auth: { token },
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on(SOCKET_CONFIG.events.CONNECT, () => {
      console.log("✅ Socket connected:", socket.id);
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: null,
        reconnectAttempts: 0,
      });
    });

    socket.on(SOCKET_CONFIG.events.DISCONNECT, (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        error: reason === "io server disconnect" ? "Server disconnected" : null,
      }));
    });

    socket.on(SOCKET_CONFIG.events.CONNECT_ERROR, (err) => {
      console.error("❌ Connection error:", err.message);
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        error: err.message,
      }));
    });

    socket.io.on(SOCKET_CONFIG.events.RECONNECT_ATTEMPT, (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}...`);
      setConnectionStatus((prev) => ({
        ...prev,
        connecting: true,
        reconnectAttempts: attempt,
      }));
    });

    socket.io.on(SOCKET_CONFIG.events.RECONNECT, (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempts`);
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: null,
        reconnectAttempts: 0,
      });
    });

    socket.io.on(SOCKET_CONFIG.events.RECONNECT_FAILED, () => {
      console.error("❌ Reconnection failed");
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        error: "Failed to reconnect",
      }));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  // Emit event
  const emit = useCallback((event: string, data?: unknown) => {
    if (!socketRef.current?.connected) {
      console.warn("⚠️ Socket not connected. Cannot emit:", event);
      return;
    }
    socketRef.current.emit(event, data);
  }, []);

  // Listen to event
  const on = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (!socketRef.current) {
        console.warn("⚠️ Socket not initialized. Cannot listen to:", event);
        return;
      }
      socketRef.current.on(event, handler);
    },
    []
  );

  // Remove event listener
  const off = useCallback(
    (event: string, handler?: (...args: unknown[]) => void) => {
      if (!socketRef.current) {
        return;
      }
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    },
    []
  );

  // Manual connect
  const connect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      setConnectionStatus((prev) => ({ ...prev, connecting: true }));
      socketRef.current.connect();
    }
  }, []);

  // Manual disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    connected: connectionStatus.connected,
    connecting: connectionStatus.connecting,
    error: connectionStatus.error,
    reconnectAttempts: connectionStatus.reconnectAttempts,
    emit,
    on,
    off,
    connect,
    disconnect,
  };
}
