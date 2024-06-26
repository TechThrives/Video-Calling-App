import Room from "../model/room";
import User from "../model/user";

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
    const room = await Room.findById(roomId).populate("participants");

    if (room) {
      // Check if the participant is already in the room
      const isParticipantExists = room.participants.some((participant) =>
        participant.equals(peerId)
      );

      if (!isParticipantExists) {
        // Add the participant to the room
        room.participants.push(peerId);
        await room.save(); // Save the room after modification
      }
      console.log("Room participants:", room.participants);
      socket.join(roomId); // make the user join the socket room

      // whenever anyone joins the room

      socket.on("ready", () => {
        // from the frontend once someone joins the room we will emit a ready event
        // then from our server we will emit an event to all the clients conn that a new peer has added
        socket.to(roomId).emit("user-joined", { peerId });
      });
    }
  };

  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
