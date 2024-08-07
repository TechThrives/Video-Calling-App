import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import VideoParticipant from "./VideoParticipant";
import VideoUser from "./VideoUser";
import Chat from "./Chat";
import ParticipantList from "./ParticipantList";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [isRightSideVisible, setIsRightSideVisible] = useState({
    isOpen: false,
    chat: false,
    participantList: false,
  });

  const { roomId } = useParams();
  const {
    socket,
    user,
    userData,
    setUser,
    stream,
    setStream,
    handleMic,
    handleVideo,
    buttonState,
    setButtonState,
    peerItems,
  } = useSocket();

  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeave);

    if (user && user._id && stream) {
      console.log("New user ", user._id, "has joined room", roomId);
      const audio = stream.getAudioTracks()[0].enabled;
      const video = stream.getVideoTracks()[0].enabled;
      socket.emit("joined-room", {
        roomId,
        peerId: user._id,
        audio,
        video,
      });
    }

    return () => {
      window.removeEventListener("beforeunload", handleLeave);
      socket.off("joined-room");
    };
  }, [roomId, user, socket, stream]);

  const closeRightSide = () => {
    setIsRightSideVisible((prev) => ({ ...prev, isOpen: false }));
  };

  const expandRightSide = ({ chat, participantList }) => {
    setIsRightSideVisible((prev) => ({
      ...prev,
      isOpen: true,
      chat,
      participantList,
    }));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
      setButtonState((prev) => ({ ...prev, fullscreen: true }));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setButtonState((prev) => ({ ...prev, fullscreen: false }));
    }
  };

  const handleLeave = () => {
    socket.emit("left-room", { roomId, peerId: user._id });
    setUser(null);
    setStream(null);
    navigate("/");
  };

  return (
    <>
      <div class={`overlay ${showOverlay ? "show" : ""}`}>Joining ... </div>
      <div className="app-container">
        <div className="left-side">
          <div className="navigation">
            <a
              className="nav-link icon"
              onClick={() =>
                expandRightSide({ chat: true, participantList: false })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-message-circle"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>

            <a
              className="nav-link icon"
              onClick={() =>
                expandRightSide({ chat: false, participantList: true })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-users"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </a>
          </div>
        </div>
        <div className="app-main">
          <div className="video-call-wrapper">
            {Object.keys(peerItems).map((peerId) => (
              <VideoParticipant key={peerId} data={peerItems[peerId]} />
            ))}
          </div>

          <div className="video-user-container">
            <VideoUser stream={stream} userData={userData} />
          </div>

          <div className="video-call-actions">
            <div className="extra-buttons">
          <button
              className="video-action-button chat"
              onClick={() =>
                expandRightSide({ chat: true, participantList: false })
              }
            ></button>
            <button
              className="video-action-button view-participants"
              onClick={() =>
                expandRightSide({ chat: false, participantList: true })
              }
            ></button>
            </div>
            <button
              className={`video-action-button mic ${
                buttonState.mic ? "on" : ""
              }`}
              onClick={() => handleMic({ roomId: roomId })}
            ></button>
            <button
              className={`video-action-button camera ${
                buttonState.video ? "on" : ""
              }`}
              onClick={() => handleVideo({ roomId: roomId })}
            ></button>
            <button
              className={`video-action-button maximize ${
                buttonState.fullscreen ? "minimize" : "maximize"
              }`}
              onClick={handleFullscreen}
            ></button>
            <button
              className="video-action-button endcall"
              onClick={handleLeave}
            ></button>
          </div>
        </div>

        <div
          className={`right-side ${isRightSideVisible.isOpen ? "show" : ""}`}
        >
          <button className="btn-close-right" onClick={closeRightSide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="feather feather-x-circle"
              viewBox="0 0 24 24"
            >
              <defs></defs>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M15 9l-6 6M9 9l6 6"></path>
            </svg>
          </button>
          {isRightSideVisible.chat && <Chat />}
          {isRightSideVisible.participantList && <ParticipantList />}
        </div>
      </div>
    </>
  );
};

export default MeetingRoom;
