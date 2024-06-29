import { Schema, model } from "mongoose";

const participantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Participant", participantSchema);
