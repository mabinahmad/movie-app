import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import { UserContext } from "../context/UserContext";
import { axiosInstance } from "../utils/interceptor/interceptor";

export const useLogout = () => {
  const { setShowSidebar } = useContext(MovieContext);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call logout endpoint
      await axiosInstance("/logout");
      // Remove token from local storage
      localStorage.removeItem("admin-token");

      // Clear current user data
      setCurrentUser(null);

      // Close the sidebar
      setShowSidebar(false);

      // Redirect to login page
      navigate("/login");
    } catch (error) {}
  };

  return logout;
};


