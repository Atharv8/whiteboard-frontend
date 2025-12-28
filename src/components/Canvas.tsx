// src/components/Canvas.tsx - FULL MOBILE + DESKTOP SUPPORT
import { useRef, useEffect, useCallback } from 'react';
import { useWhiteboardStore } from '../stores/whiteboardStore';

interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  userId: string;
}

interface CanvasProps {
  roomId: string;
  socket: any;
}

// Unified event type for pointer + touch
type DrawingEvent = React.PointerEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>;

export const Canvas = ({ roomId, socket }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<{ points: { x: number; y: number }[] } | null>(null);

  const strokes = useWhiteboardStore((state) => state.strokes);
  const selectedColor = useWhiteboardStore((state) => state.selectedColor);
  const selectedWidth = useWhiteboardStore((state) => state.selectedWidth);
  const addStroke = useWhiteboardStore((state) => state.addStroke);
  const updateCursor = useWhiteboardStore((state) => state.updateCursor);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };
    window.addEventListener('resize', resize);
    resize();
    
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Redraw all strokes when strokes change
  const redraw = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    strokes.forEach((stroke: Stroke) => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    });
  }, [strokes]);

  useEffect(() => {
    redraw();
  }, [strokes, redraw]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleStroke = ({ userId, stroke }: { userId: string; stroke: Stroke }) => {
      addStroke({ ...stroke, userId });
    };

    const handleCursorMove = ({ userId, x, y, name }: { userId: string; x: number; y: number; name?: string }) => {
      updateCursor(userId, { x, y, color: getUserColor(userId), name });
    };

    socket.on('stroke', handleStroke);
    socket.on('cursor-move', handleCursorMove);

    return () => {
      socket.off('stroke', handleStroke);
      socket.off('cursor-move', handleCursorMove);
    };
  }, [socket, roomId, addStroke, updateCursor]);

  const getUserColor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return `#${"00000".substring(0, 6 - c.length) + c}`;
  };

  // FIXED: Unified coordinates for pointer + touch
  const getCoordinates = (e: DrawingEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e && e.touches.length > 0) {
      // Touch event (mobile)
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Pointer event (desktop)
      clientX = (e as React.PointerEvent).clientX;
      clientY = (e as React.PointerEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // FIXED: Unified drawing handlers
  const startDrawing = useCallback((e: DrawingEvent) => {
    e.preventDefault();
    const coordinates = getCoordinates(e);
    isDrawingRef.current = true;
    
    currentStrokeRef.current = {
      points: [{ x: coordinates.x, y: coordinates.y }]
    };
    
    const ctx = ctxRef.current!;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = selectedWidth;
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);
  }, [selectedColor, selectedWidth]);

  const draw = useCallback((e: DrawingEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    
    const coordinates = getCoordinates(e);
    currentStrokeRef.current.points.push(coordinates);
    
    const ctx = ctxRef.current!;
    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();
  }, []);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    
    const stroke: Stroke = {
      id: crypto.randomUUID(),
      points: currentStrokeRef.current.points,
      color: selectedColor,
      width: selectedWidth,
      userId: socket.id
    };
    
    addStroke(stroke);
    socket.emit('stroke', { roomId, stroke });
    
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
  }, [selectedColor, selectedWidth, socket, roomId, addStroke]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ touchAction: 'none' }}  // Prevent mobile scroll
    />
  );
};
