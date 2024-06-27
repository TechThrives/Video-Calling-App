import Room from "../model/room";
import User from "../model/user";
import Participant from "../model/participant";

const roomHandler = (socket) => {
  // Create a room
  const createRoom = async () => {
    const room = await Room.create({ participants: [] });
    console.log("Room created", room);
    socket.join(room._id);
    socket.emit("room-created", { roomId: room._id });
  };

  //new user joins the room
  const joinedRoom = async ({ roomId, peerId }) => {
    console.log("joined room called", roomId, peerId);
    // Find the room by ID and populate the participants
    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (room) {
      // Check if the participant is already in the room by checking the user's ID
      const isParticipantExists = room.participants.some(
        (participant) =>
          participant.user &&
          participant.user._id &&
          participant.user._id.equals(peerId) // Check participant's user ID
      );

      if (!isParticipantExists) {
        // Create a new participant
        const newParticipant = new Participant({ user: peerId });

        // Save the new participant
        await newParticipant.save();

        // Add the new participant to the room
        room.participants.push(newParticipant._id);
        await room.save(); // Save the room after modification
      }

      console.log("Room participants:", room.participants);
      socket.join(roomId); // make the user join the socket room
      socket.to(roomId).emit("user-joined", { peerId });

      // whenever anyone joins the room
      socket.on("ready", () => {
        // from the frontend once someone joins the room we will emit a ready event
        // then from our server we will emit an event to all the clients conn that a new peer has added
        socket.to(roomId).emit("user-joined", { peerId });
      });
    }
  };

  const leavedRoom = async ({ roomId, peerId }) => {
    console.log("leave room called", roomId, peerId);
    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (room) {
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

      socket.to(roomId).emit("user-disconnected", {
        peerId: peerId,
      });

      socket.leave(roomId);
    }
  };

  const videoMuted = async ({ roomId, peerId, video }) => {
    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (room) {
      // Find the participant in the room
      const participant = room.participants.find(
        (participant) =>
          participant.user &&
          participant.user._id &&
          participant.user._id.equals(peerId)
      );
      if (participant) {
        // Update the video field
        participant.video = video;
        await participant.save(); // Save the updated participant
        // Emit the video-mute event to other clients in the room
        socket.to(roomId).emit("video-mute", { peerId, video });
      }
    }
  };

  const audioMuted = async ({ roomId, peerId, audio }) => {
    const room = await Room.findById(roomId).populate({
      path: "participants",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (room) {
      // Find the participant in the room
      const participant = room.participants.find(
        (participant) =>
          participant.user &&
          participant.user._id &&
          participant.user._id.equals(peerId)
      );

      if (participant) {
        // Update the video field
        participant.audio = audio;
        await participant.save(); // Save the updated participant
        // Emit the video-mute event to other clients in the room
        socket.to(roomId).emit("audio-mute", { peerId, audio });
      }
    }
  };

  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
  socket.on("leave-room", leavedRoom);
  socket.on("video-mute", videoMuted);
  socket.on("audio-mute", audioMuted);
};

export default roomHandler;
