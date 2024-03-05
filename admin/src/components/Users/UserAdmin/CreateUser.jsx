import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateUser.css";
//=====================================================

// Environment variable for API endpoint for user signup
//=====================================================
const API_USER_SIGNUP = import.meta.env.VITE_API_USER_SIGNUP;
//=====================================================

//CreateUser component  for user registration.
export const CreateUser = () => {
  // State variable to manage form input  fields
  //----------------------------------------------
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    status: "Active",
  });
  // State variable to manage form  error fields
  //----------------------------------------------
  const [errorFields, setErrorFields] = useState({
    username: false,
    email: false,
    password: false,
    role: false,
  });

  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to handle input change in form fields
  //------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    formValidation();
  };

  // Function to handle role selection
  //------------------------------------------------
  const handleRoleChange = (event) => {
    const { value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      role: value,
    }));
    formValidation();
  };

  // Function to clear form input fields
  //------------------------------------------------
  const clearInput = () => {
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "",
    });
  };

  // Function to create a new user
  //------------------------------------------------
  const createUser = async () => {
    try {
      const response = await axios(API_USER_SIGNUP, {
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
  //------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValidation()) {
      createUser(newUser);
      clearInput();
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    }
  };

  // Function to validate form fields
  //------------------------------------------------
  const formValidation = () => {
    const errors = {
      username: false,
      email: false,
      password: false,
      role: false,
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
    if (newUser.role === "") {
      errors.role = true;
    }

    setErrorFields(errors);
    if (Object.values(errors).some((error) => error === true)) {
      return false;
    }
    return true;
  };

  return (
    <div className="user-admin-container">
      <div className="signup-content">
        <h1>Register</h1>
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
          <select
            name="role"
            value={newUser.role}
            onChange={handleRoleChange}
            className={errorFields.role ? "danger" : ""}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Super Admin">Super Admin</option>
            <option value="User Administrator">User Administrator</option>
            <option value="Content Administrator">Content Administrator</option>
          </select>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
