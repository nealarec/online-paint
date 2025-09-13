import { Server, Socket } from "socket.io";
import { Room, Path, Point } from "@paint/shared";
import roomService, { RoomWithTimestamps } from "./room";

interface SocketData {
  roomId: string;
  username: string;
  position?: Point;
}

export const socketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Handle joining a room
    socket.on(
      "join_room",
      async (
        data: SocketData,
        callback: (room: RoomWithTimestamps | null) => void
      ) => {
        const { roomId, username, position } = data;
        const user = { id: socket.id, name: username };

        try {
          let room = roomService.getRoom(roomId);

          // Create room if it doesn't exist
          if (!room) {
            room = roomService.createRoom(user, `Room ${roomId}`, position);
          } else {
            // Join existing room
            room = roomService.joinRoom(roomId, user, position);
          }

          if (!room) {
            return callback(null);
          }

          // Join the socket room
          await socket.join(roomId);

          // Store room and user data in socket
          socket.data.roomId = roomId;
          socket.data.userId = user.id;

          // Notify others in the room
          socket.to(roomId).emit("user_joined", {
            userId: user.id,
            user,
            position,
            room,
          });

          // Send current room state to the user
          callback(room);
        } catch (error) {
          console.error("Error joining room:", error);
          callback(null);
        }
      }
    );

    // Handle drawing events
    socket.on("draw_start", (data: { roomId: string; path: Path }) => {
      const { roomId, path } = data;
      socket
        .to(roomId)
        .emit("draw_start", { userId: socket.data.userId, path });
    });

    socket.on("draw_update", (data: { roomId: string; path: Path }) => {
      const { roomId, path } = data;
      socket
        .to(roomId)
        .emit("draw_update", { userId: socket.data.userId, path });
    });

    socket.on("draw_end", (data: { roomId: string; path: Path }) => {
      const { roomId, path } = data;
      const updatedRoom = roomService.addPath(roomId, path);
      if (updatedRoom) {
        socket.to(roomId).emit("draw_end", {
          userId: socket.data.userId,
          path,
          room: updatedRoom,
        });
      }
    });

    // Handle cursor movement
    socket.on("cursor_move", (data: { roomId: string; position: Point }) => {
      const { roomId, position } = data;
      if (socket.data.userId) {
        roomService.updateUserPosition(roomId, socket.data.userId, position);
        socket.to(roomId).emit("user_moved", {
          userId: socket.data.userId,
          position,
        });
      }
    });

    // Handle clearing the canvas
    socket.on("clear_canvas", (roomId: string) => {
      const updatedRoom = roomService.clearRoom(roomId);
      if (updatedRoom) {
        io.to(roomId).emit("canvas_cleared", { room: updatedRoom });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const { roomId, userId } = socket.data;
      if (roomId && userId) {
        roomService.leaveRoom(roomId, userId);
        socket.to(roomId).emit("user_left", { userId });
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
