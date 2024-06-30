import React from "react";

const Message = ({ message, reverse }) => {
  return (
    <>
      <div className={`message-wrapper ${reverse}`}>
        <div className="profile-picture">
          <img
            src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
            alt=""
          />
        </div>
        <div className="message-content">
          <p className="name">{message.sender.name}</p>
          <div className="message">{message.content}</div>
        </div>
      </div>
    </>
  );
};

export default Message;
