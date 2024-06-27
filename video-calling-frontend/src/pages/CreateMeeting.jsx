import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

export const CreateMeeting = () => {
  const { socket, stream, setStream, handleMic, handleVideo, buttonState } =
    useSocket();
  const videoRef = useRef(null);

  const initRoom = () => {
    console.log("Initialising a req to create a room", socket);
    socket.emit("create-room");
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = stream.getAudioTracks()[0].enabled;
    }
  }, [stream]);

  return (
    <>
      <div className="app-wrapper">
        <div className="create-meet">
          <div className="meet-info">
            <h2>We are Creative Tech Enthusiast working since 2015</h2>
            <div className="text">
              I am Rahul Yaduvanshi works at Css3 Transition since last 3 years.
              We are here to provide touch notch solution for your website or
            </div>
          </div>
          <div className="meet-video">
            <div className="video-own">
              <video ref={videoRef} muted autoPlay></video>
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

          <button className="btn" onClick={initRoom}>
            Join Meeting
          </button>
        </div>
      </div>
    </>
  );
};
