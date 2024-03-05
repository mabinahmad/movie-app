import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
//====================================================================

// API endpoint for user registration
//==============================================
const API_USER = import.meta.env.VITE_API_USER;
//==============================================

export const Signup = () => {
  // Accessing theme context
  //------------------------
  const { isLightMode } = useContext(ThemeContext);

  // Hook for navigation
  //------------------------
  const navigate = useNavigate();

  // State for new user information and error fields
  //------------------------------------------------
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "Customer",
    status: "Active",
  });

  // State for new user  error fields
  //--------------------------------------------------
  const [errorFields, setErrorFields] = useState({
    username: false,
    email: false,
    password: false,
  });

  // Function to handle input change
  //-----------------------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    formValidation(event);
  };

  // Function to clear input fields
  //-----------------------------------------------------------------
  const clearInput = () => {
    setNewUser({
      username: "",
      email: "",
      password: "",
    });
  };

  // Function to create a new user
  //-----------------------------------------------------------------
  const createUser = async (newUser) => {
    try {
      const response = await axios(API_USER, {
        method: "POST",
        data: {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          status: newUser.status,
        },
      });
      toast.success("Successfuly registered");
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // Function to handle form submission
  //-----------------------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    if (formValidation()) {
      createUser(newUser);
      clearInput();
      setTimeout(() => {
        navigate("/home");
      }, 6000);
    }
  };

  // Form validation function
  //-----------------------------------------------------------------
  const formValidation = () => {
    const errors = {
      username: false,
      email: false,
      password: false,
    };

    if (newUser.username === "") {
      errors.username = true;
    }
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

  return (
    <div className={`signup-wrapper ${isLightMode ? "light-mode" : ""}`}>
      <div className="signup-content">
        <h1>Sign Up </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            placeholder="Username"
            className={errorFields.username ? "danger" : ""}
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            placeholder="Email "
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
            Sign Up
          </button>
        </form>

        <div className="log-in-link">
          Already registered? <Link to="/login">Sign In</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
