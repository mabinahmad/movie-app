import { Navigate, Outlet } from "react-router-dom";

// Component for creating protected routes
//------------------------------------------
export const ProtectedRoute = () => {
  // Retrieve token from local storage
  const token = localStorage.getItem("admin-token");

  // Render the child routes if token exists, otherwise redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};
