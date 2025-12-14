// WebSocketClient.ts
type EventCallback = (data: any) => void;

interface WSListeners {
  [event: string]: EventCallback[];
}

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: WSListeners = {};
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  connect() {
    this.socket = new WebSocket(`ws://localhost:8000/ws/${this.userId}`);

    this.socket.onopen = () => {
      console.log("[WS] Connected");
    };

    this.socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        const event = data.event;
        if (event && this.listeners[event]) {
          this.listeners[event].forEach((cb) => cb(data));
        }
      } catch (e) {
        console.error("[WS] Message parse error:", e);
      }
    };

    this.socket.onclose = () => {
      console.log("[WS] Disconnected");
    };

    this.socket.onerror = (err) => {
      console.error("[WS] Error:", err);
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  send(event: string, payload: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ event, ...payload }));
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: EventCallback) {
    if (!callback) {
      delete this.listeners[event];
    } else {
      this.listeners[event] = (this.listeners[event] || []).filter(
        (cb) => cb !== callback
      );
    }
  }

  // --------------------------
  // Convenience methods
  // --------------------------
  sendMessage(conversation_id: string, receiver_id: string, content: string, temp_id?: string) {
    this.send("send_message", { conversation_id, receiver_id, content, temp_id });
  }

  markDelivered(conversation_id: string, sender_id: string) {
    this.send("mark_delivered", { conversation_id, sender_id });
  }

  markSeenAll(conversation_id: string, sender_id: string) {
    this.send("mark_seen_all", { conversation_id, sender_id });
  }

  startTyping() {
    this.send("typing", {});
  }

  stopTyping() {
    this.send("stop_typing", {});
  }

  deleteMessage(message_id: string) {
    this.send("delete_message", { message_id });
  }
}
