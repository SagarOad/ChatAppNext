const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Initialize Socket.IO server
  const io = new Server(server, {
    path: "/api/socket",
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for chat messages
    socket.on("chatMessage", (message) => {
      io.emit("message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Start the server on port 3000
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server listening on http://localhost:3000");
  });
});
