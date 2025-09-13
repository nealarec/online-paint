import express from "express";
import cors from "cors";
import { greet } from "@paint/shared";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  const greeting = greet("API User");
  res.status(200).json({
    status: "healthy",
    message: greeting,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
