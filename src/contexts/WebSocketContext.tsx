'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { WebSocketClient } from "@/utils/WebsocketClient";

const WebSocketContext = createContext<WebSocketClient | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    const user = JSON.parse(userString);
    const userId = user._id;

    const client = new WebSocketClient(userId);
    client.connect();

    setWsClient(client); // ✅ update context value

    return () => {
      client.disconnect();
      setWsClient(null);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={wsClient}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
