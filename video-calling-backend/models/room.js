import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  name: String,
  participants: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
});

export default model("Room", roomSchema);
