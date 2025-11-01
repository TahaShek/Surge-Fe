// Realtime Types
import { Socket } from "socket.io-client";

export interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler?: (...args: unknown[]) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

export interface ConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

// Base event payload
export interface BaseEventPayload {
  timestamp: string;
  userId?: string;
}

// Generic event callback type
export type EventHandler<T = unknown> = (data: T) => void;

