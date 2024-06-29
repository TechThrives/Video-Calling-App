import Room from "../models/room";
import User from "../models/user";
import Participant from "../models/participant";
import express from "express";

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
