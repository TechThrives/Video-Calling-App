import React, { useEffect, useRef, useState } from "react";
import Lobby from "../components/Lobby";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import MeetingRoom from "../components/MeetingRoom";

export const Meeting = () => {
  const [roomData, setRoomData] = useState(null);
  const [isRoomExist, setRoomExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { socket, isJoined } = useSocket();
  const { roomId } = useParams();

  useEffect(() => {
    console.log("Req to check room", roomId);
    socket.emit("check-room", { roomId });

    socket.on("room-exists", ({ room, status }) => {
      console.log("room-exists", room, status);
      if (status) {
        setRoomData(room);
        setRoomExist(status);
      } else {
        setRoomData(null);
        setRoomExist(status);
      }
      setIsLoading(false);
    });

    return () => {
      socket.off("check-room");
      socket.off("room-exists");
    };
  }, [socket]);

  if (!isJoined) {
    return (
      <Lobby
        roomData={roomData}
        isRoomExist={isRoomExist}
        isLoading={isLoading}
      />
    );
  } else {
    return <MeetingRoom />;
  }
};

export default Meeting;
