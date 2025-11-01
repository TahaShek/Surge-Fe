import React, { createContext, useContext, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import type { SocketContextValue } from "../types";

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketData = useSocket();
  const { connected, connecting, error, reconnectAttempts } = socketData;

  // Log lifecycle + connection updates
  useEffect(() => {
    console.log("🧩 SocketProvider mounted — initializing socket connection...");
    return () => {
      console.log("🔌 SocketProvider unmounted — cleaning up socket...");
    };
  }, []);

  useEffect(() => {
    if (connecting) console.log("🟡 Socket connecting...");
    if (connected) console.log("🟢 Socket connected successfully!");
    if (!connected && !connecting)
      console.log("🔴 Socket disconnected or not initialized.");
    if (error) console.error("❌ Socket error:", error);
    if (reconnectAttempts > 0)
      console.log(`🔄 Reconnection attempt #${reconnectAttempts}`);
  }, [connected, connecting, error, reconnectAttempts]);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocketContext must be used inside SocketProvider");
  return ctx;
}
