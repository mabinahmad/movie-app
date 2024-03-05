import { createContext, useState } from "react";

// Creating a new context for managing theme state
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State to manage the theme mode (light or dark)
  //-----------------------------------------------------
  const [isLightMode, setIsLightMode] = useState(false);

  // Function to toggle the theme mode
  //-----------------------------------------------------
  const handleToggle = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  // Providing theme mode and toggle function to children via context provider
  return (
    <ThemeContext.Provider value={{ isLightMode, handleToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
