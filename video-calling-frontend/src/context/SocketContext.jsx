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
import fetchService from "../services/fetchService";

//Sound Effects
import useSound from "use-sound";
import joinSfx from "../sounds/join.mp3";
import leftSfx from "../sounds/left.mp3";
import { notify } from "../services/toastService";

// Create the context
export const SocketContext = createContext(null);

// Initialize socket connection
const socket = SocketIoClient(process.env.REACT_APP_SERVER, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

// Context provider component
export const SocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const [peerItems, peerDispatch] = useReducer(peerReducer, initialState);
  const [isJoined, setIsJoined] = useState(false);

  const [user, setUser] = useState();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImg: "",
  });
  const [stream, setStream] = useState(null);
  const [buttonState, setButtonState] = useState({
    mic: true,
    video: true,
    fullscreen: false,
  });

  //Sound effects
  const [joinSound] = useSound(joinSfx);
  const [leftSound] = useSound(leftSfx);

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
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    if (roomId && user._id) {
      socket.emit("audio-mute", {
        roomId,
        peerId: user._id,
        audio: stream.getAudioTracks()[0].enabled,
      });
    }
    setButtonState((prev) => ({
      ...prev,
      mic: stream.getAudioTracks()[0].enabled,
    }));
  };

  const handleVideo = ({ roomId }) => {
    if (!stream) return;
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    if (roomId && user._id) {
      socket.emit("video-mute", {
        roomId,
        peerId: user._id,
        video: stream.getVideoTracks()[0].enabled,
      });
    }
    setButtonState((prev) => ({
      ...prev,
      video: stream.getVideoTracks()[0].enabled,
    }));
  };

  useEffect(() => {
    const url = "/api/user";
    const options = {
      credentials: "include",
    };

    fetchService(url, options).then((response) => {
      setUserData(response);
      console.log("response", response);
      let newPeer;
      if (process.env.REACT_APP_PEER_PORT) {
        newPeer = new Peer(response._id, {
          host: process.env.REACT_APP_PEER_SERVER,
          port: process.env.REACT_APP_PEER_PORT,
          path: process.env.REACT_APP_PEER_PATH,
          secure: true,
        });
      } else {
        newPeer = new Peer(response._id, {
          host: process.env.REACT_APP_PEER_SERVER,
          // port: process.env.REACT_APP_PEER_PORT,
          path: process.env.REACT_APP_PEER_PATH,
          secure: true,
        });
      }

      setUser(newPeer);

      fetchUserFeed();
    });
  }, []);

  useEffect(() => {
    if (!user || !stream || !userData) return;

    socket.on("invalid-request", ({ message }) => {
      notify(400, message);
    });

    // we will transfer the user to the room page when we collect an event of room-created from server
    socket.on("room-created", ({ roomId }) => {
      console.log("New room created", roomId);
      navigate(`/meeting/${roomId}`);
      setIsJoined(true);
      console.log("New room created user", user);
    });

    socket.on("user-joined", ({ peer, audio, video }) => {
      const options = {
        metadata: {
          audio: stream.getAudioTracks()[0].enabled,
          video: stream.getVideoTracks()[0].enabled,
          user: userData,
        },
      };

      const call = user.call(peer._id, stream, options);
      call.on("stream", (peerStream) => {
        peerDispatch(addPeerAction(peer, peerStream, audio, video));
        joinSound();
      });
    });

    user.on("call", (call) => {
      console.log("Received call", call);
      
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        peerDispatch(
          addPeerAction(
            call.metadata.user,
            remoteStream,
            call.metadata.audio, // Delayed data in call
            call.metadata.video
          )
        );
      });
    });

    socket.on("left-room", ({ peer }) => {
      console.log("User disconnected", peer);
      peerDispatch(removePeerAction(peer));
      leftSound();
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

      stream.getTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });
    };
  }, [stream, socket, user, userData]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        user,
        setUser,
        userData,
        setUserData,
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
