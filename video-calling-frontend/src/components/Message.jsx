import React from "react";

const Message = ({ message, reverse }) => {
  return (
    <>
      <div className={`message-wrapper ${reverse}`}>
        <div className="profile-picture">
          <img
            src={`${process.env.REACT_APP_SERVER}/api/user/image/${message.sender._id}`}
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
