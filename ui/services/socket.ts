import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  RoomWithTimestamps,
  DrawStartEvent,
  DrawUpdateEvent,
  DrawEndEvent,
  CursorMoveEvent,
  UserJoinedEvent,
  UserLeftEvent,
  Point,
  CanvasClearedEvent,
} from "@paint/shared";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private static instance: SocketService;

  private constructor() {
    this.initializeSocket();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private initializeSocket() {
    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }

  public connect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit("leave_room", roomId);
      this.socket.disconnect();
    }
  }

  public clearCanvas(roomId: string) {
    if (this.socket) {
      this.socket.emit("clear_canvas", roomId);
    }
  }

  public joinRoom(
    roomId: string,
    username: string,
    position?: Point,
    callback?: (room: RoomWithTimestamps | null) => void
  ) {
    if (this.socket) {
      this.socket.emit("join_room", { roomId, username, position }, (room) => {
        if (room && callback) {
          // Convert string dates to Date objects if they're strings
          const roomWithDates = {
            ...room,
            createdAt:
              typeof room.createdAt === "string"
                ? new Date(room.createdAt)
                : room.createdAt,
            updatedAt:
              typeof room.updatedAt === "string"
                ? new Date(room.updatedAt)
                : room.updatedAt,
            users: Object.entries(room.users).reduce(
              (acc, [id, user]) => ({
                ...acc,
                [id]: {
                  ...user,
                  position: user.position || undefined,
                },
              }),
              {}
            ),
          };
          callback(roomWithDates);
        } else if (callback) {
          callback(null);
        }
      });
    }
  }

  public drawStart(roomId: string, path: any) {
    if (this.socket) {
      this.socket.emit("draw_start", { roomId, path });
    }
  }

  public drawUpdate(roomId: string, path: any) {
    if (this.socket) {
      this.socket.emit("draw_update", { roomId, path });
    }
  }

  public drawEnd(roomId: string, path: any) {
    if (this.socket) {
      this.socket.emit("draw_end", { roomId, path });
    }
  }

  public moveCursor(roomId: string, position: Point) {
    if (this.socket) {
      this.socket.emit("cursor_move", { roomId, position });
    }
  }

  public onUserJoined(callback: (data: UserJoinedEvent) => void) {
    if (this.socket) {
      this.socket.on("user_joined", (data) => {
        // Ensure position is properly typed
        callback({
          ...data,
          user: {
            ...data.user,
            position: data.position || data.user.position,
          },
        });
      });
    }
  }

  public onUserLeft(callback: (data: UserLeftEvent) => void) {
    if (this.socket) {
      this.socket.on("user_left", callback);
    }
  }

  public onDrawStart(callback: (data: DrawStartEvent) => void) {
    if (this.socket) {
      this.socket.on("draw_start", callback);
    }
  }

  public onDrawUpdate(callback: (data: DrawUpdateEvent) => void) {
    if (this.socket) {
      this.socket.on("draw_update", callback);
    }
  }

  public onDrawEnd(callback: (data: DrawEndEvent) => void) {
    if (this.socket) {
      this.socket.on("draw_end", callback);
    }
  }

  public onCursorMove(callback: (data: CursorMoveEvent) => void) {
    if (this.socket) {
      this.socket.on("user_moved", callback);
    }
  }

  public onCanvasCleared(callback: (data: CanvasClearedEvent) => void) {
    if (this.socket) {
      this.socket.on("canvas_cleared", callback);
    }
  }

  public offAllListeners() {
    if (this.socket) {
      this.socket.off("user_joined");
      this.socket.off("user_left");
      this.socket.off("canvas_cleared");
      this.socket.off("draw_start");
      this.socket.off("draw_update");
      this.socket.off("draw_end");
      this.socket.off("user_moved");
    }
  }

  public getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

export const socketService = SocketService.getInstance();
