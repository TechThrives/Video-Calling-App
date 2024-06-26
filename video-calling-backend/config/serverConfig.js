import dotenv from "dotenv";

dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 5000,
};

export default serverConfig;
