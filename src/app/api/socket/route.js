// app/api/socket/route.js
import { Server } from "socket.io";

let io;

export async function GET(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO...");

    // Initialize Socket.IO server
    const httpServer = res.socket.server;
    io = new Server(httpServer, {
      path: "/api/socket",
    });

    res.socket.server.io = io;

    // Set up connection listener
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("chatMessage", (message) => {
        // Broadcast the message to all connected clients
        io.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.IO already running");
  }

  res.end();
}