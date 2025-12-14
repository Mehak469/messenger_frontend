'use client';
import { useEffect } from "react";
import { WebSocketClient } from "@/utils/WebsocketClient";

let wsClient: WebSocketClient | null = null;

export function WebSocketProvider() {
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    const user = JSON.parse(userString);
    const userId = user._id;

    wsClient = new WebSocketClient(userId);
    wsClient.connect();

    return () => {
      wsClient?.disconnect();
    };
  }, []);

  return null; // doesn't render anything
}

export { wsClient };
