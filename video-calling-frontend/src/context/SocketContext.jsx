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

  const [user, setUser] = useState();
  const [stream, setStream] = useState();

  const fetchParticipantList = ({ roomId, participants }) => {
    console.log("Fetched room participants");
    console.log(roomId, participants);
  };

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  useEffect(() => {
    const userId = localStorage.getItem("username");
    const newPeer = new Peer(userId, {
      host: "192.168.0.111",
      port: 9000,
      path: "/myapp",
    });

    setUser(newPeer);

    fetchUserFeed();

    const enterRoom = ({ roomId }) => {
      navigate(`chatroom/${roomId}`);
    };

    // we will transfer the user to the room page when we collect an event of room-created from server
    socket.on("room-created", enterRoom);

    socket.on("get-users", fetchParticipantList);
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((userstream) => {
          var call = user.call(peerId, userstream);
          console.log("Call and new peer", call, peerId);
          call.on("stream", (peerStream) => {
            peerDispatch(addPeerAction(peerId, peerStream));
          });
        });
    });

    user.on("call", (call) => {
      console.log("New call", call);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        (userstream) => {
          call.answer(userstream);
          call.on("stream", function (remoteStream) {
            peerDispatch(addPeerAction(call.peer, remoteStream));
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });

    socket.on("user-disconnected", ({ peerId }) => {
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
