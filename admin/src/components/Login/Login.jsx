import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../utils/interceptor/interceptor";
import "./Login.css";
//====================================================================

export const Login = () => {
  const { setCurrentUser } = useContext(UserContext);

  // State variables
  //-------------------------------------------------
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  const [errorFields, setErrorFields] = useState({
    email: false,
    password: false,
  });

  // Hooks
  //------------------------------
  const navigate = useNavigate();
  const inputRef = useRef();

  // Function to handle input change
  //--------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function for form validation
  //--------------------------------------------------
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

  // Function to handle login
  //--------------------------------------------------
  const handleLogin = async () => {
    const adminRoles = [
      "Super Admin",
      "User Administrator",
      "Content Administrator",
    ];
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

      if (adminRoles.includes(response.data.role)) {
        localStorage.setItem("admin-token", response.data.accessToken);
        setCurrentUser(response.data._id);
        toast.success("Successfuly logged in");
        navigate("/");
      }
    } catch (error) {
      toast.error("You do not have permission to access the admin panel");
    }
  };

  // Function to handle form submission
  //--------------------------------------------------
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (formValidation()) {
      handleLogin();
      navigate("/");
    }
  };

  //To focus on the email input field on component mount
  //--------------------------------------------------
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="login-container">
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
        <button type="submit">Sign In</button>
      </form>
      <ToastContainer />
    </div>
  );
};
