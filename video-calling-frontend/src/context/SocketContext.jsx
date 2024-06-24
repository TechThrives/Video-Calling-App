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
import { v4 as UUIDv4 } from "uuid";
import {
  addPeerAction,
  removePeerAction,
  peerReducer,
  initialState,
} from "../reducers/PeerReducer";

const WS_Server = "http://localhost:5000";

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
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);

  // Fetch user media stream
  const fetchUserFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
    } catch (error) {
      console.error("Error fetching user media:", error);
    }
  };

  // Handle fetching participant list
  const fetchParticipantList = ({ roomId, participants }) => {
    console.log("Fetched room participants:", roomId, participants);
  };

  // Handle entering a room
  const enterRoom = ({ roomId }) => {
    navigate(`/chatroom/${roomId}`);
  };

  useEffect(() => {
    // Initialize user ID and Peer connection
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    setUser(newPeer);

    fetchUserFeed();

    // Socket event listeners
    socket.on("room-created", enterRoom);
    socket.on("get-users", fetchParticipantList);

    return () => {
      socket.off("room-created", enterRoom);
      socket.off("get-users", fetchParticipantList);
    };
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    // Handle user joining
    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("Calling the new peer", peerId);
      call.on("stream", (remoteStream) => {
        peerDispatch(addPeerAction(peerId, remoteStream));
      });
    });

    // Handle receiving a call
    user.on("call", (call) => {
      console.log("Receiving a call");
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        peerDispatch(addPeerAction(call.peer, remoteStream));
      });
    });

    socket.emit("ready");

    return () => {
      socket.off("user-joined");
      user.off("call");
    };
  }, [user, stream]);

  return (
    <SocketContext.Provider
      value={{ socket, user, stream, peerItems, peerDispatch }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the Socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
