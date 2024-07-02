import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// Create the context
export const ThemeContext = createContext(null);

// Context provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Cookies.get("theme") == "dark" ? true : false
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      Cookies.set("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      Cookies.set("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the Theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};
