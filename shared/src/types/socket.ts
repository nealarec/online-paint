import { Path, Point } from ".";

// User and Room Types
export interface User {
  id: string;
  name: string;
  position?: Point;
}

export interface Room {
  id: string;
  name: string;
  users: Record<string, User>;
  paths: Path[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomWithTimestamps
  extends Omit<Room, "createdAt" | "updatedAt"> {
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Join Room
export interface JoinRoomData {
  roomId: string;
  username: string;
  position?: Point;
}

// Draw Events
export interface DrawStartEvent {
  userId: string;
  path: Path;
}

export interface DrawUpdateEvent {
  userId: string;
  path: Path;
}

export interface DrawEndEvent {
  userId: string;
  path: Path;
  room: RoomWithTimestamps;
}

// Cursor Events
export interface CursorMoveEvent {
  userId: string;
  position: Point;
}

// Room Events
export interface UserJoinedEvent {
  userId: string;
  user: User;
  position?: Point;
  room: RoomWithTimestamps;
}

export interface UserLeftEvent {
  userId: string;
}

export interface CanvasClearedEvent {
  room: RoomWithTimestamps;
}

// Socket Events
export interface ServerToClientEvents {
  // Draw events
  draw_start: (data: DrawStartEvent) => void;
  draw_update: (data: DrawUpdateEvent) => void;
  draw_end: (data: DrawEndEvent) => void;

  // Cursor events
  user_moved: (data: CursorMoveEvent) => void;

  // Room events
  user_joined: (data: UserJoinedEvent) => void;
  user_left: (data: UserLeftEvent) => void;
  canvas_cleared: (data: CanvasClearedEvent) => void;
}

export interface ClientToServerEvents {
  // Room events
  join_room: (
    data: JoinRoomData,
    callback: (room: RoomWithTimestamps | null) => void
  ) => void;
  leave_room: (roomId: string) => void;

  // Draw events
  draw_start: (data: { roomId: string; path: Path }) => void;
  draw_update: (data: { roomId: string; path: Path }) => void;
  draw_end: (data: { roomId: string; path: Path }) => void;

  // Cursor events
  cursor_move: (data: { roomId: string; position: Point }) => void;

  // Canvas events
  clear_canvas: (roomId: string) => void;
}
