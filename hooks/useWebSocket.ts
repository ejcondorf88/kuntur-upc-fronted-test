import { useEffect, useRef, useState } from 'react';
import { createWebSocketClient } from '../adapter/websocketClient';

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    ws.current = createWebSocketClient(url, {
      onOpen: () => setConnected(true),
      onMessage: (data) => setLastMessage(data),
      onError: () => setConnected(false),
      onClose: () => setConnected(false),
    });

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return {
    connected,
    lastMessage,
    send: (msg: any) => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
    },
  };
} 