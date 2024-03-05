import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/interceptor";

// Creating a new context for managing user state
//-------------------------------------------------------------
export const UserContext = createContext();

// Component for providing user state and authentication functions to its children
//----------------------------------------------------------------------------------
export const UserProvider = ({ children }) => {
  // State to manage the current user and authentication token
  //-------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState({});
  const token = localStorage.getItem("token");

  // Hook from React Router DOM for programmatic navigation
  const navigate = useNavigate();

  // Function to handle user logout
  //-------------------------------------------------------------
  const handleLogout = async () => {
    try {
      // Making a request to the server to logout
      await axiosInstance("/logout");
      // Removing token from local storage and resetting current user state
      localStorage.removeItem("token");
      setCurrentUser(null);
      // Redirecting to the login page
      navigate("/login");
    } catch (error) {}
  };

  // Function to fetch the current user data
  //-------------------------------------------------------------
  const fetchCurrentUser = async () => {
    try {
      // Retrieving the stored token from local storage
      const storedToken = token;
      if (storedToken) {
        // Making a request to the server to get user data
        const response = await axiosInstance("/user", {
          headers: {
            Authorization: storedToken,
          },
        });
        // Updating the current user state with fetched data
        setCurrentUser(response.data);
      }
    } catch (error) {}
  };

  // Function to fetch current user data when token(user) changes
  //-------------------------------------------------------------
  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  // Providing current user state, token, logout function, and child components via context provider
  return (
    <UserContext.Provider
      value={{ currentUser, token, setCurrentUser, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
