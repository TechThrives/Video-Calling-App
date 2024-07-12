import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import Participants from "./Participants";

const Lobby = ({ roomData, isRoomExist, isLoading }) => {
  const {
    socket,
    stream,
    setIsJoined,
    handleMic,
    handleVideo,
    buttonState,
    userData,
  } = useSocket();

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
    }
  }, [stream]);

  const initRoom = () => {
    console.log("Initialising a req to create a room", socket);
    socket.emit("create-room");
  };

  const joinRoom = () => {
    setIsJoined(true);
  };
  return (
    <>
      <div
        class={`overlay ${isLoading ? "dark-show" : ""} ${
          !stream ? "dark-show" : ""
        }`}
      >
        Loading ...
      </div>
      <div className="app-main">
        <div className="lobby-meet">
          <div className="lobby-info">
            <h4>We are Creative Tech Enthusiast working since 2015</h4>
          </div>

          {isRoomExist ? (
            <Participants
              participants={roomData.participants.filter(
                (p) => p._id != userData._id
              )}
            />
          ) : (
            <div className="empty-lobby"></div>
          )}

          <div className="lobby-video">
            <div className="lobby-own">
              <video ref={videoRef} autoPlay></video>
              <img
                src={`data:image/png;base64,${userData && userData.profileImg}`}
                className={`${
                  stream && stream.getVideoTracks()[0].enabled ? "" : "show"
                }`}
              />

              <div className="video-call-actions">
                <button
                  className={`video-action-button mic ${
                    buttonState.mic ? "on" : ""
                  }`}
                  onClick={handleMic}
                ></button>
                <button
                  className={`video-action-button camera ${
                    buttonState.video ? "on" : ""
                  }`}
                  onClick={handleVideo}
                ></button>
              </div>
            </div>
          </div>
          <div className="lobby-btn">
            {isRoomExist ? (
              <button className="btn" onClick={joinRoom}>
                Join Meeting
              </button>
            ) : (
              <button className="btn" onClick={initRoom}>
                Create Meeting
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
