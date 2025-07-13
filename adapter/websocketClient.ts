export type WebSocketEvents = {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
};

export function createWebSocketClient(url: string, events: WebSocketEvents) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    events.onOpen?.();
  };

  ws.onmessage = (event) => {
    let data = event.data;
    try {
      data = JSON.parse(event.data);
    } catch {}
    events.onMessage?.(data);
  };

  ws.onerror = (error) => {
    events.onError?.(error);
  };

  ws.onclose = () => {
    events.onClose?.();
  };

  return ws;
} 