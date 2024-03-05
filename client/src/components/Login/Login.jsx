// import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCombineContext } from "../../hooks/useCombineContext";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../utils/interceptor";
import { UserContext } from "../../context/UserContext";

export const Login = () => {
  // Initialize state variables and hooks
  //---------------------------------------------------------------------
  const { setCurrentUser } = useContext(UserContext);
  const { themeContext } = useCombineContext();
  const { isLightMode } = themeContext;
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  // State to track input field errors
  const [errorFields, setErrorFields] = useState({
    email: false,
    password: false,
  });

  // Event handler for input changes
  //---------------------------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function to handle login
  //---------------------------------------------------------------------
  const handleLogin = async (event) => {
    try {
      const response = await axiosInstance("/login", {
        method: "POST",
        withCredentials: true,
        data: {
          email: newUser.email,
          password: newUser.password,
        },
      });

      // Check if the user is Inactive
      if (response.data.status === "Inactive") {
        toast.error("You do not have permission to access the admin panel.");
        return;
      }

      if (response.data.role === "Customer") {
        localStorage.setItem("token", response.data.accessToken);
        setCurrentUser(response.data._id);
        toast.success("Successfuly logged in");
        // window.location.reload();
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function for form validation
  //---------------------------------------------------------------------
  const formValidation = () => {
    const errors = {
      email: false,
      password: false,
    };

    if (newUser.email === "") {
      errors.email = true;
    }
    if (newUser.password === "") {
      errors.password = true;
    }
    setErrorFields(errors);
    if (Object.values(errors).some((error) => error === true)) {
      return false;
    }
    return true;
  };

  //Function for Login form submission
  //---------------------------------------------------------------------
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (formValidation()) {
      handleLogin();
      navigate("/home");
    }
  };

  // UseEffect hook to focus on the email input field when component mounts
  //---------------------------------------------------------------------
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Render the login form
  //---------------------------------------------------------------------
  return (
    <div className={`login-wrapper ${isLightMode ? "light-mode" : ""}`}>
      <div className="login-content">
        <h1>Sign In</h1>
        <form onSubmit={handleLoginSubmit}>
          <input
            ref={inputRef}
            type="text"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            placeholder="Email"
            className={errorFields.email ? "danger" : ""}
          />
          <input
            type="text"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            placeholder="Password"
            className={errorFields.password ? "danger" : ""}
          />
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        <div className="forgot-password-link">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </div>
        <div className="sign-up-link">
          <span>New to DebugMedia ?</span> <Link to="/signup">Sign Up</Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
