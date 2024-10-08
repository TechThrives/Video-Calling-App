import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  profileImg: { type: Buffer },
});

export default model("User", userSchema);
