import express from "express";
import serverConfig from "./config/serverConfig";
import dbConfig from "./config/dbConfig";
import sslConfig from "./config/sslConfig";
import { Server } from "socket.io";
import https from "https";
import cors from "cors";
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

const server = https.createServer(sslConfig, app);

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

//peerjs --port 9000 --key peerjs --path /myapp
