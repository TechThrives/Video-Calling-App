import { Schema, model } from "mongoose";

const participantSchema = new Schema({
  audio: Boolean,
  video: Boolean,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Participant", participantSchema);
