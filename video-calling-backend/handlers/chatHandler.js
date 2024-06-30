import Message from "../models/message";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const chatHandler = (socket) => {
  const sendMessage = async ({ roomId, content, senderId }) => {
    if (ObjectId.isValid(senderId) && ObjectId.isValid(roomId)) {
      try {
        const message = new Message({
          content,
          sender: senderId,
          room: roomId,
        });
        await message.save();

        // send all messages to the room
        const messages = await Message.find({ room: roomId }).populate(
          "sender"
        );
        socket.emit("get-messages", { messages }); // Broadcast to the room
      } catch (error) {
        console.error("Error saving message:", error);
      }
    } else {
      console.log("Invalid request");
      socket.emit("invalid-request", { message: "Invalid IDs" });
    }
  };

  const requestMessages = async ({ roomId }) => {
    try {
      const messages = await Message.find({ room: roomId }).populate("sender");
      socket.emit("get-messages", { messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  socket.on("request-messages", requestMessages);
  socket.on("send-message", sendMessage);
};

export default chatHandler;
