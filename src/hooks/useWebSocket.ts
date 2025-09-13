import { useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  island: string;
  data: any;
}

interface UseWebSocketOptions {
  onUpdate?: (data: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { onUpdate, onConnect, onDisconnect, onError } = options;

  useEffect(() => {
    // Create WebSocket connection
    const wsUrl = url || import.meta.env.VITE_WS_URL || import.meta.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/lottery-updates';
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to all islands
      wsRef.current?.send(JSON.stringify({
        type: 'subscribe',
        islands: ['jamaica', 'barbados', 'svg', 'trinidad', 'grenada', 'stlucia', 'dominica', 'antigua', 'stkitts', 'guyana', 'belize']
      }));
      
      if (onConnect) onConnect();
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === 'lottery_update' && onUpdate) {
          onUpdate(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      if (onDisconnect) onDisconnect();
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (wsRef.current) {
          wsRef.current = new WebSocket(wsUrl);
        }
      }, 5000);
    };

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onUpdate, onConnect, onDisconnect, onError]);

  return wsRef.current;
};