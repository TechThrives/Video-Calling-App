import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { roomId } = useParams();

  const { socket, user } = useSocket();

  const scrollToBottom = () => {
    const chatArea = document.querySelector(".chat-area");
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

  useEffect(() => {
    socket.emit("request-messages", { roomId });

    socket.on("get-messages", ({ messages }) => {
      console.log("received");
      setMessages(messages);

      scrollToBottom();
    });

    return () => {
      socket.off("get-messages");
    };
  }, [socket]);

  return (
    <>
      <div className="chat-container">
        <div className="chat-area">
          {messages.map((message) => (
            <Message
              message={message}
              reverse={user._id === message.sender._id ? "reverse" : ""}
              key={message._id}
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
    </>
  );
};

export default Chat;
