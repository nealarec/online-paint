import { v4 as uuidv4 } from "uuid";
import { Room, User, Path, Point } from "@paint/shared";

export interface RoomWithTimestamps
  extends Omit<Room, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
}

export class RoomService {
  private rooms: Record<string, RoomWithTimestamps> = {};

  createRoom(user: User, name: string, position?: Point): RoomWithTimestamps {
    const now = new Date();
    const room: RoomWithTimestamps = {
      id: name,
      name: "Room " + name,
      users: { [user.id]: { ...user, position } },
      paths: [],
      createdAt: now,
      updatedAt: now,
    };

    this.rooms[room.id] = room;
    return room;
  }

  getRoom(roomId: string): RoomWithTimestamps | undefined {
    return this.rooms[roomId];
  }

  joinRoom(
    roomId: string,
    user: User,
    position?: Point
  ): RoomWithTimestamps | undefined {
    const room = this.rooms[roomId];
    if (!room) return undefined;

    room.users[user.id] = { ...user, position };
    room.updatedAt = new Date();
    return room;
  }

  leaveRoom(roomId: string, userId: string): void {
    const room = this.rooms[roomId];
    if (!room) return;

    delete room.users[userId];
    room.updatedAt = new Date();

    // Clean up empty rooms
    if (Object.keys(room.users).length === 0) {
      delete this.rooms[roomId];
    }
  }

  addPath(roomId: string, path: Path): RoomWithTimestamps | undefined {
    const room = this.rooms[roomId];
    if (!room) return undefined;

    room.paths.push(path);
    room.updatedAt = new Date();
    return room;
  }

  updateUserPosition(
    roomId: string,
    userId: string,
    position: Point
  ): RoomWithTimestamps | undefined {
    const room = this.rooms[roomId];
    if (!room || !room.users[userId]) return undefined;

    room.users[userId].position = position;
    room.updatedAt = new Date();
    return room;
  }

  clearRoom(roomId: string): RoomWithTimestamps | undefined {
    const room = this.rooms[roomId];
    if (!room) return undefined;

    room.paths = [];
    room.updatedAt = new Date();
    return room;
  }

  getAllRooms(): RoomWithTimestamps[] {
    return Object.values(this.rooms);
  }
}

export default new RoomService();
