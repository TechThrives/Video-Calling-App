import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Meeting from "./pages/Meeting";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/meetingroom/:roomId"
          element={
            <SocketProvider>
              <Meeting />
            </SocketProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
