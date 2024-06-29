import Room from "../model/room";
import User from "../model/user";
import Participant from "../model/participant";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const roomHandler = (socket) => {
  // check if room exists
  const checkRoom = async ({ roomId: roomId }) => {
    if (ObjectId.isValid(roomId)) {
      const room = await Room.findById(roomId).populate({
        path: "participants",
        populate: {
          path: "user",
          model: "User",
        },
      });

      if (room) {
        socket.emit("room-exists", {
          room: room,
          status: true,
        });
        return;
      }
    }

    socket.emit("room-exists", {
      room: null,
      status: false,
    });
  };

  // Create a room
  const createRoom = async () => {
    const room = await Room.create({ participants: [] });
    console.log("Room created", room);
    socket.join(room._id);
    socket.emit("room-created", { roomId: room._id });
  };

  //new user joins the room
  const joinedRoom = async ({ roomId, peerId, audio, video }) => {
    console.log("joined room called", roomId, peerId);

    if (ObjectId.isValid(peerId) && ObjectId.isValid(roomId)) {
      // Find the user by ID
      const user = await User.findById(peerId);

      // Find the room by ID and populate the participants
      const room = await Room.findById(roomId).populate({
        path: "participants",
        populate: {
          path: "user",
          model: "User",
        },
      });

      if (user && room) {
        // Check if the participant is already in the room by checking the user's ID
        const isParticipantExists = room.participants.some(
          (participant) =>
            participant.user &&
            participant.user._id &&
            participant.user._id.equals(peerId) // Check participant's user ID
        );

        if (!isParticipantExists) {
          // Create a new participant
          const newParticipant = new Participant({
            user: peerId,
          });

          // Save the new participant
          await newParticipant.save();

          // Add the new participant to the room
          room.participants.push(newParticipant._id);
          await room.save(); // Save the room after modification
        }

        socket.join(roomId); // make the user join the socket room
        socket.to(roomId).emit("user-joined", { peer: user, audio, video });

        // new user joined and ready to send and receive stream
        socket.on("ready", () => {
          // from the frontend once someone joins the room we will emit a ready event
          // then from our server we will emit an event to all the clients conn that a new peer has added
          socket.to(roomId).emit("user-joined", { peer: user, audio, video });
        });
      }
    } else {
      console.log("Invalid request");
      socket.emit("invalid-request");
      return;
    }
  };

  const leftRoom = async ({ roomId, peerId }) => {
    console.log("user left room", roomId, peerId);

    // Find the user by ID
    const user = await User.findById(peerId);

    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (user && room) {
      // Check if the participant is already in the room by checking the user's ID
      const isParticipantExists = room.participants.some(
        (participant) =>
          participant.user &&
          participant.user._id &&
          participant.user._id.equals(peerId) // Check participant's user ID
      );

      if (isParticipantExists) {
        // Remove the participant from the room
        room.participants = room.participants.filter(
          (participant) => !participant.user._id.equals(peerId)
        );
        await room.save(); // Save the room after modification
      }

      socket.to(roomId).emit("left-room", {
        peer: user,
      });

      socket.leave(roomId);
      socket.disconnect();
    }
  };

  const videoMuted = async ({ roomId, peerId, video }) => {
    // Emit the video-mute event to other clients in the room
    socket.to(roomId).emit("video-mute", { peerId, video });
  };

  const audioMuted = async ({ roomId, peerId, audio }) => {
    // Emit the video-mute event to other clients in the room
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
