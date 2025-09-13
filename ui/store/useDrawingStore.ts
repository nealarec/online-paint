import { create } from 'zustand';
import { Drawing, Path, Point } from '@paint/shared';

type DrawingState = {
  // Current drawing state
  currentDrawing: Drawing | null;
  currentPath: Path | null;
  isDrawing: boolean;
  
  // Drawing settings
  color: string;
  weight: number;
  tool: 'brush' | 'pencil' | 'eraser';
  
  // Actions
  startDrawing: (point: Point) => void;
  draw: (point: Point) => void;
  endDrawing: () => void;
  clearCanvas: () => void;
  setColor: (color: string) => void;
  setWeight: (weight: number) => void;
  setTool: (tool: 'brush' | 'pencil' | 'eraser') => void;
  loadDrawing: (drawing: Drawing) => void;
};

export const useDrawingStore = create<DrawingState>((set, get) => ({
  // Initial state
  currentDrawing: {
    name: 'Untitled',
    paths: [],
  },
  currentPath: null,
  isDrawing: false,
  color: '#000000',
  weight: 5,
  tool: 'pencil',
  
  // Actions
  startDrawing: (point) => {
    const { color, weight, tool } = get();
    const newPath: Path = {
      points: [point],
      color: tool === 'eraser' ? '#FFFFFF' : color,
      weight,
      tool,
    };
    
    set({
      currentPath: newPath,
      isDrawing: true,
    });
  },
  
  draw: (point) => {
    const { currentPath, isDrawing } = get();
    if (!isDrawing || !currentPath) return;
    
    set((state) => ({
      currentPath: {
        ...currentPath,
        points: [...currentPath.points, point],
      },
    }));
  },
  
  endDrawing: () => {
    const { currentPath, currentDrawing } = get();
    if (!currentPath) return;
    
    // Only add the path if it has at least 2 points
    if (currentPath.points.length >= 2) {
      set({
        currentDrawing: {
          ...currentDrawing!,
          paths: [...currentDrawing!.paths, currentPath],
        },
      });
    }
    
    set({
      currentPath: null,
      isDrawing: false,
    });
  },
  
  clearCanvas: () => {
    set((state) => ({
      currentDrawing: {
        ...state.currentDrawing!,
        paths: [],
      },
      currentPath: null,
      isDrawing: false,
    }));
  },
  
  setColor: (color) => set({ color }),
  
  setWeight: (weight) => set({ weight }),
  
  setTool: (tool) => set({ tool }),
  
  loadDrawing: (drawing) => {
    set({
      currentDrawing: drawing,
      currentPath: null,
      isDrawing: false,
    });
  },
}));
