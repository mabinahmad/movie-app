import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/interceptor/interceptor";
import { MovieContext } from "./MovieContext";
import { useLogout } from "../hooks/useLogout";
//================================================================

// Context for managing user-related data
//------------------------------------------
export const UserContext = createContext();

// API URLs for user-related operations
//==================================================================
const API_USERS = import.meta.env.VITE_API_USERS;
const API_CURRENT_USER = import.meta.env.VITE_API_CURRENT_USER;
const API_ADMIN_CUSTOMER = import.meta.env.VITE_API_ADMIN_CUSTOMER;
//==================================================================

export const UserProvider = ({ children }) => {
  // State variables for managing current user, users list, admin users, and customer users
  //-----------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Retrieve token from local storage
  //-----------------------------------------------------------------
  const token = localStorage.getItem("admin-token");

  // Function to fetch data of the currently logged-in user
  //-----------------------------------------------------------------
  const fetchCurrentUser = async () => {
    try {
      // Fetch current user data from the API using the stored token for authorization
      const storedToken = token;
      if (storedToken) {
        const response = await axios(API_CURRENT_USER, {
          headers: {
            Authorization: storedToken,
          },
        });

        // Update current user state with the fetched data
        setCurrentUser(response.data);
      }
    } catch (error) {}
  };

  // Function to fetch the list of all users
  //-----------------------------------------------------------------
  const fetchUsersList = async () => {
    try {
      const response = await axios(API_USERS);
      setUsers(response.data);
    } catch (error) {}
  };

  // Function to fetch admin and customer users
  //-----------------------------------------------------------------
  const fetchUsers = async () => {
    try {
      // Fetch admin and customer users data from the API
      const response = await axios(API_ADMIN_CUSTOMER);
      // Update admin and customer users states with the fetched data
      setAdminUsers(response.data.adminUsers);
      setCustomers(response.data.customerUsers);
    } catch (error) {}
  };

  // useEffect hook to fetch users list and admin/customer users data when the component mounts
  //------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchUsersList();
    fetchUsers();
  }, []);

  // useEffect hook to fetch current user data when the token changes
  //-----------------------------------------------------------------
  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  // Provide user-related data to components via context
  //-----------------------------------------------------------------
  return (
    <UserContext.Provider
      value={{
        currentUser,
        token,
        users,
        adminUsers,
        customers,
        setCurrentUser,
        setUsers,
        setAdminUsers,
        setCustomers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
