import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const certificateStream = path.resolve(process.env.SSL_CRT_FILE);
const keyStream = path.resolve(process.env.SSL_KEY_FILE);

const certificate = fs.readFileSync(certificateStream, "utf8");
const privateKey = fs.readFileSync(keyStream, "utf8");

const sslConfig = {
  cert: certificate,
  key: privateKey,
  passphrase: process.env.PASSPHRASE,
};

export default sslConfig;
