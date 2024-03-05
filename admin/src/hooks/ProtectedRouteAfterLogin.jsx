import { Navigate, Outlet } from "react-router-dom";

// Component to manage routing after login, ensuring user redirection based on authentication status
//---------------------------------------------------------------------------------------------------
export const ProtectedRouterAfterLogin = () => {
  // Retrieve token from local storage
  const token = localStorage.getItem("admin-token");

  // If token exists (user is authenticated), redirect to the home page, otherwise render the child routes
  return token ? <Navigate to="/" /> : <Outlet />;
};
