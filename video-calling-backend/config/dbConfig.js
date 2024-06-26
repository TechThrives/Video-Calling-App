import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// DB CONNECTION
const dbConfig = connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default dbConfig;
