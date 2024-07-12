import Room from "../models/room";
import User from "../models/user";
import Participant from "../models/participant";
import express from "express";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const router = express.Router();

// GET /rooms/:roomId/participants/:peerId
router.get("/:roomId/participant/:peerId", async (req, res) => {
  try {
    const { roomId, peerId } = req.params;
    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const participant = room.participants.find(
      (participant) =>
        participant.user &&
        participant.user._id &&
        participant.user._id.equals(peerId)
    );

    if (participant) {
      return res.json({ participant });
    } else {
      return res
        .status(404)
        .json({ message: "Participant not found in the room" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get /rooms/:roomId
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;

  if (ObjectId.isValid(roomId)) {
    try {
      const room = await Room.findById(roomId).populate({
        path: "participants",
        populate: {
          path: "user",
          model: "User",
        },
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      return res.status(201).json(room);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(404).json({ message: "Room not found" });
  }
});

export default router;
