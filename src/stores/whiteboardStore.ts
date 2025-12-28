// src/stores/whiteboardStore.ts - FULL WORKING VERSION
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Point { 
  x: number; 
  y: number; 
}

interface Stroke { 
  id: string; 
  points: Point[]; 
  color: string; 
  width: number; 
  userId: string;
}

interface Cursor { 
  x: number; 
  y: number; 
  color: string; 
  name?: string; 
}

interface WhiteboardState {
  strokes: Stroke[];
  cursors: Record<string, Cursor>;
  selectedColor: string;
  selectedWidth: number;
  history: Stroke[][];
  historyIndex: number;
  
  // Actions
  addStroke: (stroke: Stroke) => void;
  updateCursor: (userId: string, cursor: Cursor) => void;
  setTool: (color: string, width: number) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>()(
  devtools(
    (set, get) => ({
      strokes: [],
      cursors: {},
      selectedColor: '#000000',
      selectedWidth: 3,
      history: [[]],
      historyIndex: 0,

      addStroke: (stroke: Stroke) => {
        const { strokes, history, historyIndex } = get();
        const newStrokes = [...strokes, stroke];
        
        set({
          strokes: newStrokes,
          history: history.slice(0, historyIndex + 1).concat([newStrokes]),
          historyIndex: historyIndex + 1
        });
      },

      updateCursor: (userId: string, cursor: Cursor) => {
        set((state) => ({
          cursors: { 
            ...state.cursors, 
            [userId]: cursor 
          }
        }));
      },

      setTool: (color: string, width: number) => {
        set({ selectedColor: color, selectedWidth: width });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          set({ 
            strokes: history[historyIndex - 1],
            historyIndex: historyIndex - 1 
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          set({ 
            strokes: history[historyIndex + 1],
            historyIndex: historyIndex + 1 
          });
        }
      },

      clear: () => {
        set({ 
          strokes: [],
          history: [[]],
          historyIndex: 0 
        });
      }
    }), 
    { name: 'whiteboard' }
  )
);
