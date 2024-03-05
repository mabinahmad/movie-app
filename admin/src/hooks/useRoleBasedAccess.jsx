import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
//========================================================

// Custom hook for role-based access control
//------------------------------------------------------------
export const useRoleBasedAccess = (allowedRoles) => {
  // Access currentUser from the UserContext
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate an asynchronous check of authentication status
  //---------------------------------------------------------
  const checkAuthentication = async () => {
    // Simulating a delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Set loading state to false after authentication check is complete
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isLoading) {
    // Rendering a loading spinner while authentication status is being checked
    return <LoadingSpinner />;
  }

  // Extracted the role of the current user
  const role = currentUser?.role;

  // Checking if the user's role is included in the list of allowed roles
  if (allowedRoles.includes(role)) {
    // If the user's role is allowed, render the child routes
    return <Outlet />;
  } else {
    // If the user's role is not allowed, display a message indicating lack of permission
    return <p>You do not have permission to access this page </p>;
  }
};
