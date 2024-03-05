import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCombineContext } from "../../hooks/useCombineContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
//=========================================================================

// API endpoints from .env file
//=========================================================================
const API_FORGOT_PASSWORD = import.meta.env.VITE_API_FORGOT_PASSWORD;
const API_VERIFY_OTP = "http://localhost:3005/users/verify-otp";
const API_RESET_PASSWORD = import.meta.env.VITE_API_RESET_PASSWORD;
//=========================================================================

export const ForgotPassword = () => {
  // State variables to manage form data and steps
  //--------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); // 1 for email input, 2 for OTP input, 3 for new password input
  const [expirationTime, setExpirationTime] = useState(null);

  // Accessing theme context and navigation
  //--------------------------------------------------------------------
  const { themeContext } = useCombineContext();
  const { isLightMode } = themeContext;
  const navigate = useNavigate();

  // Function for email input change
  //--------------------------------------------------------------------
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  // Function for submitting email form
  //--------------------------------------------------------------------
  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await axios(API_FORGOT_PASSWORD, {
        method: "POST",
        data: { email },
      });
      // Show success toast and proceed to OTP input step
      toast.success("Email submitted successfuly");
      if (response.status === 200) {
        setToken(response.data.otpToken);
        setExpirationTime(response.data.expirationTime);
        setTimeout(() => {
          setStep(2);
        }, 5000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  // Function to calculate remaining time until expiration
  //--------------------------------------------------------------------
  const calculateRemainingTime = () => {
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  };

  //Function for verifying OTP
  //--------------------------------------------------------------------
  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(API_VERIFY_OTP, {
        token,
        otp,
      });
      console.log(response, "response");
      // Show success toast and proceed to new password input step
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          setStep(3);
        }, 5000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //Function for submitting reset password form
  //--------------------------------------------------------------------
  const handleSubmitNewPassword = async (event) => {
    event.preventDefault();

    try {
      // Send request to reset password
      const response = await axios(API_RESET_PASSWORD, {
        method: "POST",
        data: {
          token,
          newPassword,
          confirmPassword,
        },
      });
      // Show success toast and navigate to login page
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Error:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpirationTime(0);
      setStep(1);
    }, calculateRemainingTime());
    return () => clearTimeout(timer);
  }, [expirationTime]);

  // Render the component
  //-------------------------------------------------------------------------
  return (
    <div>
      {step === 1 && (
        <div className={`forgot-password ${isLightMode ? "light-mode" : ""}`}>
          <h4>Enter email address</h4>
          <form onSubmit={handleSubmitEmail}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleChange} className="input-field email-input"
            />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="form-container">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="input-field"
          />
          <button type="submit" className="submit-button">
            Verify OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handleSubmitNewPassword}
          className="reset-password-form-container"
        >
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new Password"
            required
            className="new-password-input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="confirm-password-input"
          />
          <button type="submit" className="reset-password-submit-button">
            Submit
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};
