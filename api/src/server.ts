import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { socketService } from "./services/socket";

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Default Expo web port
    methods: ["GET", "POST"],
  },
  // Enable connection state recovery
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});

// Initialize Socket.IO
socketService(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
  console.log(`WebSocket server is running at ws://localhost:${PORT}`);
});

export default app;
