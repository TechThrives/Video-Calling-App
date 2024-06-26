import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  name: String,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model("Room", roomSchema);
