import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatroom/:roomId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
