import User from "../models/user";
import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware";
import multer from "multer";

const { ObjectId } = mongoose.Types;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert profile image buffer to base64 string if it exists
    let profileImgBase64 = null;
    if (user.profileImg) {
      profileImgBase64 = user.profileImg.toString("base64");
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: profileImgBase64,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/user/update",
  authMiddleware,
  upload.single("profileImg"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUserData = {
        name: req.body.name,
      };

      if (req.file) {
        updatedUserData.profileImg = req.file.buffer;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updatedUserData
      );

      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/user/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (ObjectId.isValid(userId)) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Convert profile image buffer to base64 string if it exists
      let profileImgBase64 = null;
      if (user.profileImg) {
        profileImgBase64 = user.profileImg.toString("base64");
      }

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImg: profileImgBase64,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    console.log("Invalid request");
    res.status(400).json({ message: "Invalid ID" });
  }
});

router.get("/user/image/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (ObjectId.isValid(userId)) {
    try {
      const user = await User.findById(userId);

      if (!user || !user.profileImg) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.set("Content-Type", "image/png");
      return res.status(200).send(user.profileImg);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
