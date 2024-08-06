import { PeerServer } from "peer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

let peerServer;

if (process.env.SSL_CRT_FILE && process.env.SSL_KEY_FILE) {
  console.log("SSL is enabled");

  const certificate = fs.readFileSync(
    path.resolve(process.env.SSL_CRT_FILE),
    "utf8"
  );
  const privateKey = fs.readFileSync(
    path.resolve(process.env.SSL_KEY_FILE),
    "utf8"
  );

  peerServer = PeerServer({
    port: 9000,
    path: "/myapp",
    key: "peerjs",
    ssl: {
      cert: certificate,
      key: privateKey,
    },
  });
} else {
  peerServer = PeerServer({
    port: 9000,
    path: "/myapp",
    key: "peerjs",
  });
}

peerServer.on("connection", (client) => {
  console.log("Peer connection established with ID: ", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("Peer disconnected: ", client.id);
});
