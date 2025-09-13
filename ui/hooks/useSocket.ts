import { useEffect, useCallback } from "react";
import { socketService } from "../services/socket";
import type {
  Point,
  RoomWithTimestamps,
  DrawStartEvent,
  DrawUpdateEvent,
  DrawEndEvent,
  CursorMoveEvent,
  UserJoinedEvent,
  UserLeftEvent,
  CanvasClearedEvent,
} from "@paint/shared";

export const useSocket = () => {
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
      socketService.offAllListeners();
    };
  }, []);

  const joinRoom = useCallback(
    (roomId: string, username: string, position?: Point) => {
      return new Promise<RoomWithTimestamps | null>((resolve) => {
        socketService.joinRoom(roomId, username, position, (room) => {
          resolve(room);
        });
      });
    },
    []
  );

  const drawStart = useCallback((roomId: string, path: any) => {
    socketService.drawStart(roomId, path);
  }, []);

  const drawUpdate = useCallback((roomId: string, path: any) => {
    socketService.drawUpdate(roomId, path);
  }, []);

  const drawEnd = useCallback((roomId: string, path: any) => {
    socketService.drawEnd(roomId, path);
  }, []);

  const moveCursor = useCallback((roomId: string, position: Point) => {
    socketService.moveCursor(roomId, position);
  }, []);

  const clearCanvas = useCallback((roomId: string) => {
    socketService.clearCanvas(roomId);
  }, []);

  const onUserJoined = useCallback(
    (callback: (data: UserJoinedEvent) => void) => {
      socketService.onUserJoined(callback);
      return () => {
        socketService.offAllListeners();
      };
    },
    []
  );

  const onUserLeft = useCallback((callback: (data: UserLeftEvent) => void) => {
    socketService.onUserLeft(callback);
    return () => {
      socketService.offAllListeners();
    };
  }, []);

  const onDrawStart = useCallback(
    (callback: (data: DrawStartEvent) => void) => {
      socketService.onDrawStart(callback);
      return () => {
        socketService.offAllListeners();
      };
    },
    []
  );

  const onDrawUpdate = useCallback(
    (callback: (data: DrawUpdateEvent) => void) => {
      socketService.onDrawUpdate(callback);
      return () => {
        socketService.offAllListeners();
      };
    },
    []
  );

  const onDrawEnd = useCallback((callback: (data: DrawEndEvent) => void) => {
    socketService.onDrawEnd(callback);
    return () => {
      socketService.offAllListeners();
    };
  }, []);

  const onCursorMove = useCallback(
    (callback: (data: CursorMoveEvent) => void) => {
      socketService.onCursorMove(callback);
      return () => {
        socketService.offAllListeners();
      };
    },
    []
  );

  const onCanvasCleared = useCallback(
    (callback: (data: CanvasClearedEvent) => void) => {
      socketService.onCanvasCleared(callback);
      return () => {
        socketService.offAllListeners();
      };
    },
    []
  );

  const getSocketId = useCallback(() => {
    return socketService.getSocketId();
  }, []);

  return {
    joinRoom,
    drawStart,
    drawUpdate,
    drawEnd,
    moveCursor,
    clearCanvas,
    onUserJoined,
    onUserLeft,
    onDrawStart,
    onDrawUpdate,
    onDrawEnd,
    onCursorMove,
    onCanvasCleared,
    getSocketId,
  };
};
