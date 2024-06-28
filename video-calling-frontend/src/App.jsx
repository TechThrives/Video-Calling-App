import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SocketWrapper from "./components/SocketWrapper";
import Meeting from "./pages/Meeting";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/meetingroom" element={<SocketWrapper />}>
          <Route index path=":roomId" element={<Meeting />} />
          <Route path=":roomId" element={<Meeting />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
