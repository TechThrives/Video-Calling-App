import Room from "../models/room";
import User from "../models/user";
import Participant from "../models/participant";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const roomHandler = (socket) => {
  // Check if room exists
  const checkRoom = async ({ roomId }) => {
    if (ObjectId.isValid(roomId)) {
      try {
        const room = await Room.findById(roomId).populate({
          path: "participants",
          populate: {
            path: "user",
            model: "User",
          },
        });

        const roomData = {
          _id: room._id,
          name: room.name,
          participants: [],
        };

        room.participants.forEach((participant) => {
          roomData.participants.push({
            _id: participant.user._id,
            name: participant.user.name,
            email: participant.user.email,
            profileImg: participant.user.profileImg
              ? participant.user.profileImg.toString("base64")
              : "",
          });
        });

        if (room) {
          socket.emit("room-exists", {
            room: roomData,
            status: true,
          });
          return;
        }
      } catch (error) {
        console.error("Error finding room:", error);
      }
    }

    socket.emit("room-exists", {
      room: null,
      status: false,
    });
  };

  // Create a room
  const createRoom = async () => {
    try {
      const room = await Room.create({ participants: [] });
      console.log("Room created", room._id.toString());
      socket.emit("room-created", { roomId: room._id.toString() });
    } catch (error) {
      console.error("Error creating room:", error);
      socket.emit("error", { message: "Failed to create room" });
    }
  };

  // New user joins the room
  const joinedRoom = async ({ roomId, peerId, audio, video }) => {
    if (ObjectId.isValid(peerId) && ObjectId.isValid(roomId)) {
      try {
        const user = await User.findById(peerId);

        // Convert profile image buffer to base64 string if it exists
        let profileImgBase64 = null;
        if (user.profileImg) {
          profileImgBase64 = user.profileImg.toString("base64");
        }

        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImg: profileImgBase64,
        };

        const room = await Room.findById(roomId).populate({
          path: "participants",
          populate: {
            path: "user",
            model: "User",
          },
        });

        if (user && room) {
          const isParticipantExists = room.participants.some(
            (participant) =>
              participant.user &&
              participant.user._id &&
              participant.user._id.equals(peerId)
          );

          if (!isParticipantExists) {
            const newParticipant = new Participant({
              user: peerId,
            });

            await newParticipant.save();
            room.participants.push(newParticipant._id);
            await room.save();
          }

          socket.join(roomId);
          socket.to(roomId).emit("user-joined", { peer: userData, audio, video });
        } else {
          socket.emit("invalid-request", { message: "User or room not found" });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    } else {
      console.log("Invalid request");
      socket.emit("invalid-request", { message: "Invalid IDs" });
    }
  };

  const leftRoom = async ({ roomId, peerId }) => {
    console.log("user left room", roomId, peerId);

    if (ObjectId.isValid(peerId) && ObjectId.isValid(roomId)) {
      try {
        const user = await User.findById(peerId);
        const room = await Room.findById(roomId).populate({
          path: "participants",
          populate: {
            path: "user",
            model: "User",
          },
        });

        if (user && room) {
          const isParticipantExists = room.participants.some(
            (participant) =>
              participant.user &&
              participant.user._id &&
              participant.user._id.equals(peerId)
          );

          if (isParticipantExists) {
            room.participants = room.participants.filter(
              (participant) => !participant.user._id.equals(peerId)
            );
            await room.save();
          }

          socket.to(roomId).emit("left-room", {
            peer: user,
          });

          socket.leave(roomId);
        } else {
          socket.emit("invalid-request", { message: "User or room not found" });
        }
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("error", { message: "Failed to leave room" });
      }
    } else {
      console.log("Invalid request");
      socket.emit("invalid-request", { message: "Invalid IDs" });
    }
  };

  const videoMuted = ({ roomId, peerId, video }) => {
    socket.to(roomId).emit("video-mute", { peerId, video });
  };

  const audioMuted = ({ roomId, peerId, audio }) => {
    socket.to(roomId).emit("audio-mute", { peerId, audio });
  };

  socket.on("check-room", checkRoom);
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
  socket.on("left-room", leftRoom);
  socket.on("video-mute", videoMuted);
  socket.on("audio-mute", audioMuted);
};

export default roomHandler;
