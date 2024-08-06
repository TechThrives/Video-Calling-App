import express from "express";
import serverConfig from "./config/serverConfig";
import dbConfig from "./config/dbConfig";
import { Server } from "socket.io";
import http from "http";
import https from "https";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import roomHandler from "./handlers/roomHandler";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatHandler from "./handlers/chatHandler";
import authMiddleware from "./middleware/authMiddleware";

const app = express();

// Handle DB connection errors
dbConfig.then(() => {
  console.log("DB CONNECTED");
});

const corsOptions = {
  credentials: true,
  origin: process.env.FRONTEND_URL,
};

console.log(process.env.FRONTEND_URL);

let server;
if (
  process.env.SSL_CRT_FILE &&
  process.env.SSL_KEY_FILE &&
  process.env.PASSPHRASE
) {
  console.log("SSL is enabled");
  const certificate = fs.readFileSync(
    path.resolve(process.env.SSL_CRT_FILE),
    "utf8"
  );
  const privateKey = fs.readFileSync(
    path.resolve(process.env.SSL_KEY_FILE),
    "utf8"
  );

  const sslConfig = {
    cert: certificate,
    key: privateKey,
    passphrase: process.env.PASSPHRASE,
  };

  server = https.createServer(sslConfig, app);
} else {
  server = http.createServer(app);
}

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");
  roomHandler(socket);
  chatHandler(io, socket);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/room", authMiddleware, roomRoutes);

server.listen(serverConfig.PORT, () => {
  console.log(`Server is up at port ${serverConfig.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
