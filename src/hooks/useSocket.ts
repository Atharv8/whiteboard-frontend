// src/hooks/useSocket.ts - FULL WORKING VERSION
import { useRef, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWhiteboardStore } from '../stores/whiteboardStore';

interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  userId: string;
}

export const useSocket = (roomId: string, userName?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const updateCursor = useWhiteboardStore((state) => state.updateCursor);
  const addStroke = useWhiteboardStore((state) => state.addStroke);

  // Connect to socket
  useEffect(() => {
    const socket = io(
      import.meta.env.DEV 
        ? 'http://localhost:3001'
        : 'https://whiteboard-backend-ngem.onrender.com',
      { transports: ['websocket','polling'] }
    );

    socketRef.current = socket;

    // Join room with userName
    socket.emit('join-room', { roomId, userName });

    // Listen for remote strokes
    socket.on('stroke', ({ userId, stroke }: { userId: string; stroke: Stroke }) => {
      addStroke({ ...stroke, userId });
    });

    // Listen for remote cursors
    socket.on('cursor-move', ({ userId, x, y, name }: { userId: string; x: number; y: number; name?: string }) => {
      updateCursor(userId, { x, y, color: getUserColor(userId), name });
    });

    socket.on('user-left', (userId: string) => {
      updateCursor(userId, { x: 0, y: 0, color: '', name: '' });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userName, addStroke, updateCursor]);

  // Mouse position tracking (for cursor emit)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Broadcast cursor every 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit('cursor-move', { 
          roomId, 
          x: mousePos.x, 
          y: mousePos.y 
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [roomId, mousePos]);

  const emitStroke = useCallback((stroke: Stroke) => {
    socketRef.current?.emit('stroke', { roomId, stroke });
  }, [roomId]);

  return { 
    socket: socketRef.current, 
    emitStroke 
  };
};

// Helper function for consistent colors
const getUserColor = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length) + c}`;
};
