import React from "react";
import { useTheme } from "../context/ThemeContext";
import { ToastContainer as TContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => {
  const { isDarkMode } = useTheme();
  return (
    <TContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      pauseOnHover={false}
      theme={isDarkMode ? "dark" : "light"}
      text
    />
  );
};

export default ToastContainer;
