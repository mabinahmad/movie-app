const jwt = require("jsonwebtoken");
// require("dotenv").config();

// Function to generate an access token
//======================================
const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
     expiresIn: "1d",
  });
};

// Function to generate a refresh token
//======================================
const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

// Function to verify a refresh token
//======================================
const verifyRefreshToken = (refreshToken) => {
  try {
    if (!refreshToken) {
      return false;
    }

    const tokenValid = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!tokenValid) {
      return false;
    }

    return tokenValid._id;
  } catch (error) {}
};

// Function to generate an OTP token
//======================================
const generateOtpToken = (email, otp) => {
  return jwt.sign({ email, otp }, process.env.OTP_TOKEN_SECRET, {
    expiresIn: "3m",
  });
};

// Function to verify an OTP token
//======================================
const verifyOtpToken = (token) => {
  try {
    if (!token) {
      return false;
    }
    const otpTokenValid = jwt.verify(token, process.env.OTP_TOKEN_SECRET);

    if (!otpTokenValid) {
      return false;
    }
    return otpTokenValid;
  } catch (error) {}
};

module.exports = {
  generateAccessToken,
  generateOtpToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyOtpToken,
};
