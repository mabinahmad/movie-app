import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouterAfterLogin = () => {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  // Redirect to home route if token exists, otherwise render child routes
  return token ? <Navigate to="/home" /> : <Outlet />;
};
export default ProtectedRouterAfterLogin;
