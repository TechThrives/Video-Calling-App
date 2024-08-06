import { PeerServer } from "peer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// const certificateStream = path.resolve(process.env.SSL_CRT_FILE);
// const keyStream = path.resolve(process.env.SSL_KEY_FILE);

// const certificate = fs.readFileSync(certificateStream, "utf8");
// const privateKey = fs.readFileSync(keyStream, "utf8");

const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  key: "peerjs",
  // ssl: {
  //   cert: certificate,
  //   key: privateKey,
  // },
});

peerServer.on("connection", (client) => {
  console.log("Peer connection established with ID: ", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("Peer disconnected: ", client.id);
});
