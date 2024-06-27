import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const keyStream = path.resolve(`../credentials/${process.env.KEY}`);
const certificateStream = path.resolve(`../credentials/${process.env.CERT}`);
const privateKey = fs.readFileSync(keyStream, "utf8");
const certificate = fs.readFileSync(certificateStream, "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: process.env.PASSPHRASE,
};

const sslConfig = { credentials };

export default sslConfig;
