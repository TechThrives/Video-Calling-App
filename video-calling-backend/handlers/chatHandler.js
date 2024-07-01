import Message from "../models/message";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const chatHandler = (io, socket) => {
  // Handle incoming messages
  const sendMessage = async ({ roomId, content, senderId }) => {
    if (ObjectId.isValid(senderId) && ObjectId.isValid(roomId)) {
      try {
        const message = new Message({
          content,
          sender: senderId,
          room: roomId,
        });
        await message.save();

        // Fetch all messages for the room
        const messages = await Message.find({ room: roomId }).populate(
          "sender"
        );

        // Broadcast to the room including the sender
        io.in(roomId).emit("get-messages", { messages });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    } else {
      console.log("Invalid request");
      socket.emit("invalid-request", { message: "Invalid IDs" });
    }
  };

  const requestMessages = async ({ roomId }) => {
    if (ObjectId.isValid(roomId)) {
      try {
        const messages = await Message.find({ room: roomId }).populate(
          "sender"
        );

        // Emit messages to the requesting socket
        socket.emit("get-messages", { messages });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      console.log("Invalid room ID");
      socket.emit("invalid-request", { message: "Invalid room ID" });
    }
  };

  socket.on("request-messages", requestMessages);
  socket.on("send-message", sendMessage);
};

export default chatHandler;
