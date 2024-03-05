import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Render child routes if token exists, otherwise redirect to login page
  return token ? <Outlet /> : <Navigate to="/login" />;

  // if (!token) {
  //   return <Navigate to="/login" />;
  // }
  // return <Outlet />;
};

export default ProtectedRoute;
