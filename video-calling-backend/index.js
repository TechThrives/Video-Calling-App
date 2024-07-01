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

const app = express();

// Handle DB connection errors
dbConfig.then(() => {
  console.log("DB CONNECTED");
});

const corsOptions = {
  credentials: true,
  origin: process.env.FRONTEND_URL,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

const server = https.createServer(sslConfig, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(serverConfig.PORT, () => {
  console.log(`Server is up at port ${serverConfig.PORT}`);
});

//peerjs --port 9000 --key peerjs --path /myapp
