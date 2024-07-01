import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Meeting from "./pages/Meeting";
import { SocketProvider } from "./context/SocketContext";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
