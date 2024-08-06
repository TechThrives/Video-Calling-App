import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// DB CONNECTION
const dbConfig = connect(process.env.MONGO_URI);

export default dbConfig;
