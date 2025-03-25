// express app
import app from "./app.js";

// for websocket 
import http from "http";
import { Server } from "socket.io";

const { SERVER_HOSTNAME, SERVER_PORT } = process.env;

const server = http.createServer(app);

// make websocket server
const io = new Server(server, {
  // specify settings for cors
  cors: {
    // where react runs
    origin: "${SERVER_HOSTNAME}:${SERVER_PORT}/",
  // what methods are we expecting
  methods: ["GET", "POST"]
}
});

// 1. listen for connection
io.on("connection", (socket) => {
  // can use socket.id for account auth?
  console.log(`User connected: ${socket.id}`);

  // 2. listen for send message 
  socket.on("send_message", (data) => {
    console.log("Received message:", data);
    // 3. emit receive message
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`);
});