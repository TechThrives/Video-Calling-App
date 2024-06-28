import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer,
} from "react";
import SocketIoClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import {
  addPeerAction,
  removePeerAction,
  videoToggleAction,
  audioToggleAction,
  peerReducer,
  initialState,
} from "../reducers/PeerReducer";

const WS_Server = "http://192.168.0.111:5000";

// Create the context
export const SocketContext = createContext(null);

// Initialize socket connection
const socket = SocketIoClient(WS_Server, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

// Context provider component
export const SocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const [peerItems, peerDispatch] = useReducer(peerReducer, initialState);
  const [isJoined, setIsJoined] = useState(false);

  const [user, setUser] = useState();
  const [stream, setStream] = useState(null);
  const [buttonState, setButtonState] = useState({
    mic: true,
    video: true,
    fullscreen: false,
  });

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    let audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = buttonState.mic;
    let videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = buttonState.video;
    setStream(stream);
  };

  const handleMic = ({ roomId }) => {
    if (!stream) return;
    let audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    if (roomId && user._id) {
      socket.emit("audio-mute", {
        roomId: roomId,
        peerId: user._id,
        audio: audioTrack.enabled,
      });
    }
    setButtonState((prev) => ({
      ...prev,
      mic: audioTrack.enabled,
    }));
  };

  const handleVideo = ({ roomId }) => {
    if (!stream) return;
    let videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    if (roomId && user._id) {
      socket.emit("video-mute", {
        roomId: roomId,
        peerId: user._id,
        video: videoTrack.enabled,
      });
    }
    setButtonState((prev) => ({
      ...prev,
      video: videoTrack.enabled,
    }));
  };

  useEffect(() => {
    const userId = localStorage.getItem("username");
    if (!userId) {
      navigate("/");
      return;
    }

    const newPeer = new Peer(userId, {
      host: "192.168.0.111",
      port: 9000,
      path: "/myapp",
    });

    setUser(newPeer);

    fetchUserFeed();

    // we will transfer the user to the room page when we collect an event of room-created from server
    socket.on("room-created", ({ roomId }) => {
      navigate(`/meetingroom/${roomId}`);
      setIsJoined(true);
    });

    return () => {
      socket.off("room-created");
      setStream(null);
    };
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("invalid-request", () => {
      navigate("/");
    });

    socket.on("user-joined", ({ peerId, audio, video }) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((userstream) => {
          var options = {
            metadata: {
              audio: stream.getAudioTracks()[0].enabled,
              video: stream.getVideoTracks()[0].enabled,
            },
          };
          var call = user.call(peerId, userstream, options);

          call.on("stream", (peerStream) => {
            peerDispatch(addPeerAction(peerId, peerStream, audio, video));
          });
        });
    });

    user.on("call", (call) => {
      console.log("Received call", call);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        (userstream) => {
          call.answer(userstream);
          call.on("stream", function (remoteStream) {
            peerDispatch(
              addPeerAction(
                call.peer,
                remoteStream,
                call.metadata.audio,
                call.metadata.video
              )
            );
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });

    socket.on("left-room", ({ peerId }) => {
      console.log("User disconnected", peerId);
      peerDispatch(removePeerAction(peerId));
    });

    socket.on("video-mute", ({ peerId, video }) => {
      peerDispatch(videoToggleAction(peerId, video));
    });

    socket.on("audio-mute", ({ peerId, audio }) => {
      peerDispatch(audioToggleAction(peerId, audio));
    });

    socket.emit("ready");

    return () => {
      socket.off("room-created");
      socket.off("get-users");
      socket.off("user-joined");
      socket.off("left-room");
      socket.off("invalid-request");
      socket.off("video-mute");
      socket.off("audio-mute");
    };
  }, [stream, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        user,
        setUser,
        stream,
        setStream,
        peerItems,
        peerDispatch,
        buttonState,
        setButtonState,
        isJoined,
        setIsJoined,
        handleMic,
        handleVideo,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the Socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
