import React from "react";
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
import { AuthProvider } from "./context/AuthContext";
import Welcome from "./pages/Welcome";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ThemeToggleButton />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/meeting" element={<PrivateRoute />}>
              <Route path="welcome" element={<Welcome />} />

              <Route
                path=":roomId"
                element={
                  <SocketProvider>
                    <Meeting />
                  </SocketProvider>
                }
              />
              <Route
                index
                element={
                  <SocketProvider>
                    <Meeting />
                  </SocketProvider>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
