import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
});

export default model("User", userSchema);
