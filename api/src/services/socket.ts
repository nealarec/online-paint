import { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  User,
  RoomWithTimestamps,
  JoinRoomData,
} from "@paint/shared";
import roomService from "./room";

export const socketService = (
  io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle joining a room
    socket.on(
      "join_room",
      async (
        data: JoinRoomData,
        callback: (room: RoomWithTimestamps | null) => void
      ) => {
        const { roomId, username, position } = data;
        const user: User = {
          id: socket.id,
          name: username,
          position,
        } as User; // Cast to include position

        try {
          let room = roomService.getRoom(roomId);

          // Create room if it doesn't exist
          if (!room) {
            room = roomService.createRoom(user, roomId, position);
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
            room: {
              ...room,
              createdAt: room.createdAt.toISOString(),
              updatedAt: room.updatedAt.toISOString(),
            },
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
    socket.on("draw_start", (data) => {
      const { roomId, path } = data;
      if (socket.data.userId) {
        socket.to(roomId).emit("draw_start", {
          userId: socket.data.userId,
          path,
        });
      }
    });

    socket.on("draw_update", (data) => {
      const { roomId, path } = data;
      if (socket.data.userId) {
        socket.to(roomId).emit("draw_update", {
          userId: socket.data.userId,
          path,
        });
      }
    });

    socket.on("draw_end", (data) => {
      const { roomId, path } = data;
      if (socket.data.userId) {
        console.log("Drawing ended:", path, roomId);
        const updatedRoom = roomService.addPath(roomId, path);
        console.log("Updated room:", updatedRoom, roomId);
        if (updatedRoom) {
          console.log("Emitting draw_end");
          socket.to(roomId).emit("draw_end", {
            userId: socket.data.userId,
            path,
            room: {
              ...updatedRoom,
              createdAt: updatedRoom.createdAt.toISOString(),
              updatedAt: updatedRoom.updatedAt.toISOString(),
            },
          });
        }
      }
    });

    // Handle cursor movement
    socket.on("cursor_move", (data) => {
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
    socket.on("clear_canvas", (roomId) => {
      const updatedRoom = roomService.clearRoom(roomId);
      if (updatedRoom) {
        io.to(roomId).emit("canvas_cleared", {
          room: {
            ...updatedRoom,
            createdAt: updatedRoom.createdAt.toISOString(),
            updatedAt: updatedRoom.updatedAt.toISOString(),
          },
        });
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
