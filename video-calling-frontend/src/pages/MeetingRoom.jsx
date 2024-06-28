import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import VideoParticipant from "../components/VideoParticipant";
import VideoUser from "../components/VideoUser";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRightSideVisible, setIsRightSideVisible] = useState(false);

  const { roomId } = useParams();
  const {
    socket,
    user,
    setUser,
    stream,
    setStream,
    handleMic,
    handleVideo,
    buttonState,
    setButtonState,
    peerItems,
  } = useSocket();

  useEffect(() => {
    if (user && user._id && stream) {
      console.log("New user ", user._id, "has joined room", roomId);
      const audio = stream.getAudioTracks()[0].enabled;
      const video = stream.getVideoTracks()[0].enabled;
      socket.emit("joined-room", {
        roomId: roomId,
        peerId: user._id,
        audio: audio,
        video: video,
      });
    }
  }, [roomId, user, socket, stream]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    return () => {
      document.body.classList.remove("dark"); // Clean up on component unmount
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const closeRightSide = () => {
    setIsRightSideVisible(false);
  };

  const expandRightSide = () => {
    setIsRightSideVisible(true);
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
    setStream(null);
    socket.emit("left-room", { roomId: roomId, peerId: user._id });
    navigate("/");
  };

  return (
    <>
      <div className="app-container">
        <button className="mode-switch" onClick={toggleDarkMode}>
          <svg
            className="sun feather feather-sun"
            fill="none"
            stroke="#fbb046"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <defs />
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>

          <svg
            className="moon feather feather-moon"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <defs />
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>
        <div className={`left-side`}>
          <div className="navigation">
            <a href="#" className="nav-link icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-home"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </a>

            <a href="#" className="nav-link icon">
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
                className="feather feather-message-square"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>
            <a href="#" className="nav-link icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-phone-call"
                viewBox="0 0 24 24"
              >
                <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94m-1 7.98v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
            <a href="#" className="nav-link icon">
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
                className="feather feather-hard-drive"
              >
                <line x1="22" y1="12" x2="2" y2="12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                <line x1="6" y1="16" x2="6.01" y2="16" />
                <line x1="10" y1="16" x2="10.01" y2="16" />
              </svg>
            </a>
            <a href="#" className="nav-link icon">
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
            <a href="#" className="nav-link icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-folder"
                viewBox="0 0 24 24"
              >
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </a>
            <a href="#" className="nav-link icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-settings"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="app-main">
          <VideoUser stream={stream} />
          <div className="video-call-wrapper">
            {Object.keys(peerItems).map((peerId) => (
              <VideoParticipant
                key={peerId}
                stream={peerItems[peerId].stream}
              />
            ))}
            {/* {Array.from("ABCDEFG").map((peerId) => (
              <VideoParticipant key={peerId} stream={stream} />
            ))} */}
          </div>

          <div className="video-call-actions">
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

        <div className={`right-side ${isRightSideVisible ? "show" : ""}`}>
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
          <div className="chat-container">
            <div className="chat-area">
              <div className="message-wrapper">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Ryan Patrick</p>
                  <div className="message">Helloo team!😍</div>
                </div>
              </div>

              <div className="message-wrapper">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Andy Will</p>
                  <div className="message">
                    Hello! Can you hear me?🤯{" "}
                    <a className="mention">@ryanpatrick</a>
                  </div>
                </div>
              </div>

              <div className="message-wrapper">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1600207438283-a5de6d9df13e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Jessica Bell</p>
                  <div className="message">Hi team! Let's get started it.</div>
                </div>
              </div>

              <div className="message-wrapper reverse">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Emmy Lou</p>
                  <div className="message">Good morning!🌈</div>
                </div>
              </div>

              <div className="message-wrapper">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1576110397661-64a019d88a98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Tim Russel</p>
                  <div className="message">New design document⬇️</div>
                  <div className="message-file">
                    <div className="icon sketch">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="#ffd54f"
                          d="M96 191.02v-144l160-30.04 160 30.04v144z"
                        />
                        <path
                          fill="#ffecb3"
                          d="M96 191.02L256 16.98l160 174.04z"
                        />
                        <path fill="#ffa000" d="M0 191.02l256 304 256-304z" />
                        <path fill="#ffca28" d="M96 191.02l160 304 160-304z" />
                        <g fill="#ffc107">
                          <path d="M0 191.02l96-144v144zM416 47.02v144h96z" />
                        </g>
                      </svg>
                    </div>
                    <div className="file-info">
                      <div className="file-name">NewYear.sketch</div>
                      <div className="file-size">120 MB</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="message-wrapper">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Ryan Patrick</p>
                  <div className="message">Hi team!❤️</div>
                  <div className="message">
                    I downloaded the file <a className="mention">@timrussel</a>
                  </div>
                </div>
              </div>

              <div className="message-wrapper reverse">
                <div className="profile-picture">
                  <img
                    src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                    alt=""
                  />
                </div>
                <div className="message-content">
                  <p className="name">Emmy Lou</p>
                  <div className="message">Woooww! Awesome❤️</div>
                </div>
              </div>
            </div>
            <div className="chat-typing-area-wrapper">
              <div className="chat-typing-area">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button className="send-button">
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
          <div className="participants">
            <div className="participant profile-picture">
              <img
                src="https://images.unsplash.com/photo-1576110397661-64a019d88a98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80"
                alt=""
              />
            </div>

            <div className="participant profile-picture">
              <img
                src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                alt=""
              />
            </div>

            <div className="participant profile-picture">
              <img
                src="https://images.unsplash.com/photo-1600207438283-a5de6d9df13e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
                alt=""
              />
            </div>

            <div className="participant profile-picture">
              <img
                src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
                alt=""
              />
            </div>
            <div className="participant-more">2+</div>
          </div>
        </div>
        <button
          className={`expand-btn ${isRightSideVisible ? "" : "show"}`}
          onClick={expandRightSide}
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
        </button>
      </div>
    </>
  );
};

export default MeetingRoom;
