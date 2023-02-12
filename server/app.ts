import express from "express";
import http from "http";
import socketio from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", function (socket) {
  socket.on("message-client", (username, message, room) => {
    socket.to(room).emit("message-server", username, message, false);
  });

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("joined", (username, room) => {
    socket
      .to(room)
      .emit(
        "message-server",
        undefined,
        username + " joined the chat, welcome him/her!",
        true
      );
  });
});

server.listen(4000, () => {
  console.log("Running at localhost:4000");
});
