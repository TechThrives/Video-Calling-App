import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import ToastContainer from "./components/ToastContainer";
import ThemeToggleButton from "./components/ThemeToggleButton";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Meeting from "./pages/Meeting";
import Register from "./pages/Register";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <ThemeToggleButton />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/meetingroom/:roomId"
              element={
                <SocketProvider>
                  <Meeting />
                </SocketProvider>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
