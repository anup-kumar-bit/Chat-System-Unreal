import { Server } from "socket.io";

export default function handler(req, res) {
  // Prevent duplicate Socket.IO initialization
  if (res.socket.server.io) {
    console.log("⚡ Socket.IO is already running");
    res.end();
    return;
  }

  // Initialize Socket.IO
  console.log("🚀 Initializing Socket.IO...");
  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });

  // Attach to Next.js server instance
  res.socket.server.io = io;

  // Socket.IO event handlers
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("sendMessage", (message) => {
      // Broadcast to all other clients
      socket.broadcast.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  res.end();
}