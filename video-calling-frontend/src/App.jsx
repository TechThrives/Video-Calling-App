import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import SocketWrapper from "./components/SocketWrapper";
import { CreateMeeting } from "./pages/CreateMeeting";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<SocketWrapper />}>
          <Route path="create-meeting" element={<CreateMeeting />} />
          <Route path="chatroom/:roomId" element={<ChatRoom />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
