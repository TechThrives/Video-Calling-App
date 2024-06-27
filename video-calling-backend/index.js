import express from "express";
import serverConfig from "./config/serverConfig";
import dbConfig from "./config/dbConfig";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import roomHandler from "./handlers/roomHandler";

const app = express();

// Handle DB connection errors
dbConfig.then(() => {
  console.log("DB CONNECTED");
});

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");
  roomHandler(socket); // pass the socket conn to the room handler for room creation and joining
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(serverConfig.PORT, () => {
  console.log(`Server is up at port ${serverConfig.PORT}`);
});

//peerjs --port 9000 --key peerjs --path /myapp
