import React from "react";
import { useSocket } from "../context/SocketContext";

export const CreateMeeting = () => {
  const { socket } = useSocket();
  const initRoom = () => {
    console.log("Initialising a req to create a room", socket);
    socket.emit("create-room");
  };

  return <button onClick={initRoom}>Start a new meeting in a new room</button>;
};
