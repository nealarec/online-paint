import { create } from "zustand";
import { socketService } from "../services/socket";
import { useDrawingStore } from "./useDrawingStore";
import type {
  User,
  Point,
  CursorMoveEvent,
  UserJoinedEvent,
  UserLeftEvent,
  DrawStartEvent,
  DrawUpdateEvent,
  DrawEndEvent,
  Path,
} from "@paint/shared";
import { memo } from "react";

interface RoomState {
  // Room state
  roomId: string | null;
  users: User[];
  currentUser: User | null;
  isConnected: boolean;

  // Actions
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: () => void;
  sendDrawStart: (point: Point) => void;
  sendDrawUpdate: (path: any) => void;
  sendDrawEnd: (path: any) => void;
  updateCursorPosition: (position: Point) => void;
  clearCanvas: () => void;

  // Socket event handlers
  handleUserJoined: (data: UserJoinedEvent) => void;
  handleUserLeft: (userId: UserLeftEvent) => void;
  handleDrawStart: (data: DrawStartEvent) => void;
  handleDrawUpdate: (data: DrawUpdateEvent) => void;
  handleDrawEnd: (data: DrawEndEvent) => void;
  handleCursorMove: (data: CursorMoveEvent) => void;
  handleClearCanvas: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  // Initial state
  roomId: null,
  users: [],
  currentUser: null,
  isConnected: false,

  // Actions
  joinRoom: (roomId: string, username: string) => {
    socketService.connect();

    // Set up socket event listeners
    socketService.onUserJoined(get().handleUserJoined);
    socketService.onUserLeft(get().handleUserLeft);
    socketService.onDrawStart(get().handleDrawStart);
    socketService.onDrawUpdate(get().handleDrawUpdate);
    socketService.onDrawEnd(get().handleDrawEnd);
    socketService.onCursorMove(get().handleCursorMove);
    socketService.onCanvasCleared(get().handleClearCanvas);

    socketService.joinRoom(roomId, username, undefined, (room) => {
      const socketId = socketService.getSocketId();
      console.log("Joined room:", room, socketId);
      set({
        roomId: room?.id || null,
        users: Object.values(room?.users || {}),
        currentUser: { id: socketId || "", name: username },
        isConnected: true,
      });
    });
  },

  leaveRoom: () => {
    const { roomId } = get();
    if (roomId) {
      socketService.disconnect();
      socketService.offAllListeners();
      set({
        roomId: null,
        users: [],
        currentUser: null,
        isConnected: false,
      });
    }
  },

  sendDrawStart: (point: Point) => {
    const { roomId, currentUser } = get();
    if (roomId && currentUser) {
      const drawingStore = useDrawingStore.getState();
      const path: Path = {
        points: [point],
        color: drawingStore.color,
        weight: drawingStore.weight,
        tool: drawingStore.tool,
      };
      socketService.drawStart(roomId, path);
    }
  },

  sendDrawUpdate: (path: any) => {
    const { roomId } = get();
    if (roomId) {
      socketService.drawUpdate(roomId, path);
    }
  },

  sendDrawEnd: (path: any) => {
    const { roomId } = get();
    if (roomId) {
      socketService.drawEnd(roomId, path);
    }
  },

  updateCursorPosition: (position: Point) => {
    const { roomId } = get();
    if (roomId) {
      socketService.moveCursor(roomId, position);
    }
  },

  clearCanvas: () => {
    const { roomId } = get();
    if (roomId) {
      socketService.clearCanvas(roomId);
    }
  },

  // Socket event handlers
  handleUserJoined: (data: UserJoinedEvent) => {
    set((state) => ({
      users: state.users.some((u) => u.id === data.userId)
        ? state.users
        : [
            ...state.users,
            {
              id: data.userId,
              name: data.user.name, // Use the user object from the event
              position: data.position,
            },
          ],
    }));
  },

  handleUserLeft: (ev: UserLeftEvent) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== ev.userId),
    }));
  },

  handleCursorMove: (data: CursorMoveEvent) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === data.userId ? { ...user, position: data.position } : user
      ),
    }));
  },

  handleDrawStart: (ev: DrawStartEvent) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === ev.userId ? { ...user, currentPath: ev.path } : user
      ),
    }));
  },

  handleDrawUpdate: (ev: DrawUpdateEvent) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === ev.userId ? { ...user, currentPath: ev.path } : user
      ),
    }));
  },

  handleDrawEnd: (ev: DrawEndEvent) => {
    set((state) => ({
      users: state.users.map((user) => {
        if (user.id === ev.userId) {
          // Add the completed path to the user's drawing
          const updatedUser = {
            ...user,
            currentPath: undefined,
            paths: [...(user.paths || []), ev.path],
          };
          return updatedUser;
        }
        return user;
      }),
    }));
  },

  handleClearCanvas: () => {
    set((state) => ({
      ...state,
      users: state.users.map((user) => ({
        ...user,
        paths: [],
        currentPath: undefined,
      })),
    }));
  },
}));

export const getAllPaths = (state: RoomState) =>
  state.users
    .flatMap((user) => user.paths || [])
    .concat(state.users.flatMap((user) => user.currentPath || [])) || [];
