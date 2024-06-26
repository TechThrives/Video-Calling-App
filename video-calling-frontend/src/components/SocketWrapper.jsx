import React from "react"; // Adjust the import path as needed
import { SocketProvider } from "../context/SocketContext";
import { Outlet } from "react-router-dom";

const SocketWrapper = () => {
  return (
    <>
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </>
  );
};

export default SocketWrapper;
