import React, { createContext, useContext } from "react";
import { useSocket } from "../hooks/useSocket";
import type { SocketContextValue } from "../types";

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketData = useSocket();
  return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used inside SocketProvider");
  return ctx;
}
