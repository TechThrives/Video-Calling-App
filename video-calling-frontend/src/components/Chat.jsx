import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { roomId } = useParams();
  const { socket, user } = useSocket();

  const scrollToBottom = () => {
    const chatArea = document.querySelector("#chat-area");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (message !== "" && user) {
      socket.emit("send-message", {
        roomId: roomId,
        content: message,
        senderId: user._id,
      });
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    // Request initial messages
    socket.emit("request-messages", { roomId });

    // Handle incoming messages
    socket.on("get-messages", ({ messages }) => {
      setMessages(messages);
    });

    // Cleanup on unmount
    return () => {
      socket.off("get-messages");
    };
  }, [socket, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-area" id="chat-area">
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            reverse={user._id === message.sender._id ? "reverse" : ""}
          />
        ))}
      </div>
      <div className="chat-typing-area-wrapper">
        <div className="chat-typing-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-button" onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-send"
              viewBox="0 0 24 24"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
