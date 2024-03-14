const { Users } = require("../models/userModel");
const { generateOTP, sendEmailOTP } = require("../utils/otp");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyOtpToken,  verifyRefreshToken,
  generateOtpToken,
} = require("../utils/jwt");

const {
  generatePasswordHash,
  comparePasswordHash,

} = require("../utils/bcrypt");

//==================================================================

//Get all users
//=========================================
const getAllUsers = async (req, res) => {
  try {
    // Retrieving all users from the database and exclude passwords from the response
    const usersList = await Users.find().select("-password");
    // Send the list of users as a JSON response
    res.status(200).json(usersList);
  } catch (error) {
    // Handle any internal server errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get all users based on roles
//============================================
const getAllUsersBasedOnRole = async (req, res) => {
  try {
    const adminRoles = [
      "Super Admin",
      "User Administrator",
      "Content Administrator",
    ];
    // Fetch admin users from the database and exclude passwords
    const adminUsers = await Users.find({ role: { $in: adminRoles } }).select(
      "-password -movies"
    );

    //case-insensitive regex
    // const adminUsers = await Users.find({
    //   role: { $regex: new RegExp(adminRoles.join("|"), "i") },
    // });

    // Fetch customer users from the database and exclude passwords
    const customerUsers = await Users.find({ role: "Customer" }).select(
      "-password"
    );

    res.status(200).json({ adminUsers, customerUsers });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get Current User
//=========================================
const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.userId);
    // If the user exists, send user details as a JSON response
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        watchlater: user.movies.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//login
//=========================================
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });

  try {
    if (!user) {
      return res.status(404).json({
        message: "Username/Password is not valid",
      });
    }

    // Check if the user is inactive
    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "You do not have permission to access the admin panel.",
        status: "Inactive",
      });
    }

    // Validate password
    const validPassword = await comparePasswordHash(password, user.password);

    if (!validPassword) {
      return res.status(404).json({
        message: "Username/Password is not valid",
      });
    }

    // Generating access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Attaching the new refresh token to HEADERS
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    // Send user details and access token as a JSON response
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Signup
//=========================================
const signup = async (req, res) => {
  const { username, email, role, status, password } = req.body;

  try {
    // Check if user already exists
    const user = await Users.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }
    // Generate hashed password
    const hashedPassword = await generatePasswordHash(password);
    // Create a new user with hashed password
    await Users.create({
      username,
      email,
      role,
      status,
      password: hashedPassword,
    });
    res.json({
      message: "Account has been created",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Logout
//=========================================
const logout = async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie("refreshToken");
  // Send logout message as a JSON response
  res.json({ message: "Logged Out" });
};

//Send OTP to user's email for password reset
//===============================================
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Generate OTP and send it to the user's email
  const otp = generateOTP();
  await sendEmailOTP(email, otp);

  // Generate JWT token with email and OTP
  const otpToken = generateOtpToken(email, otp);

  // Set the expiration time for the OTP token
  const expirationTime = Date.now() + 2 * 60 * 1000;

  res.json({ otpToken, expirationTime });
};

//Verify OTP for password reset
//===============================================
const verifyOTP = async (req, res) => {
  const { token, otp } = req.body;

  try {
    // Verify the OTP token
    const decoded = verifyOtpToken(token);

    const { otp: storedOTP } = decoded;

    // Compare provided OTP with stored OTP
    if (otp !== storedOTP.toString()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    // If OTP verification is successful, return a success response
    return res.json({ message: "verified" });
  } catch (error) {
    // Handle any unauthorized errors
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Password reset
//=========================================================
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    const decoded = verifyOtpToken(token);
    const { email } = decoded;

    // Validating new password and confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    // Hashing the new password
    const hashedPassword = await generatePasswordHash(newPassword);

    // Finding user and updating password in the database
    const user = await Users.updateOne({ email }, { password: hashedPassword });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//Refresh Token
//=========================================
const refreshTokenHandler = async (req, res) => {
  // Verifying refresh token
  const userId = verifyRefreshToken(req.cookies.refreshToken);
  if (!userId) {
    return res.status(401).json({
      message: "Refresh token is expired",
    });
  }

  // Generating new access and refresh tokens
  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  // Attaching the new refresh token to HEADERS
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.json({ accessToken: newAccessToken });
};

//Add movie to Watch Later
//=========================================
const addToWatchLater = async (req, res) => {
  //userId=>params
  //movieId=>body
  const currentDateTime = new Date();

  try {
    // Finding user and updating watch later list
    const user = await Users.findByIdAndUpdate(
      req.params.userId,
      {
        $addToSet: {
          movies: req.body.movieId,
        },
        $set: { lastMovieAddedAt: currentDateTime },
      },
      { new: true }
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      watchlater: user.movies.length,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update User Status
const updateUserStatus = async (req, res) => {
  // Getting user ID from params
  const userId = req.params.userId;
  try {
    const adminRoles = [
      "Super Admin",
      "User Administrator",
      "Content Administrator",
    ];
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Toggling user status
    user.status = user.status === "Active" ? "Inactive" : "Active";

    // Saving updated user
    const updatedUser = await user.save();

    // Fetching updated users based on role
    if (updatedUser.role === "Customer") {
      const updatedUsers = await Users.find({
        role: "Customer",
      }).select("-password");

      res.json({
        message: "Status updated successfully",
        updatedUsers,
      });
    } else {
      const updatedUsers = await Users.find({
        role: { $in: adminRoles },
      }).select("-password -movies");

      res.json({
        message: "Status updated successfully",
        updatedUsers,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get watch later movies
//===================================================
const getWatchLaterMovies = async (req, res) => {
  try {
    // Finding user by ID and populating movies
    const userList = await Users.findById(req.params.userId)
      .select("movies lastMovieAddedAt lastMovieRemovedAt ")
      .populate("movies");

    res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete watch later movie
//===================================================
const deleteWatchLaterMovie = async (req, res) => {
  // Getting user ID from params and movie ID from body
  const { userId } = req.params;
  const { movieId } = req.body;
  const currentDateTime = new Date();
  try {
    // Finding user and updating watch later list
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $pull: { movies: movieId },
        $set: { lastMovieRemovedAt: currentDateTime },
      },
      { new: true }
    )
      .select("movies lastMovieAddedAt lastMovieRemovedAt username role")
      .populate("movies");

    if (updatedUser) {
      const updatedMovies = updatedUser.movies;

      const currentUser = {
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        watchlater: updatedUser.movies.length,
      };

      return res.status(200).json({
        currentUser: currentUser,
        watchlaterUpdation: {
          lastMovieAddedAt: updatedUser.lastMovieAddedAt,
          lastMovieRemovedAt: updatedUser.lastMovieRemovedAt,
          movies: updatedMovies,
          message: `${movieId} deleted from watch later successfuly`,
        },
      });
    }
    res.status(404).json({ message: "Item does not exist" });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// Delete User
//=========================================
const deleteUser = async (req, res) => {
  //admin roles
  const adminRoles = [
    "Super Admin",
    "User Administrator",
    "Content Administrator",
  ];
  try {
    const { _id } = req.body;
    // Deleting user by ID
    const deletedUser = await Users.findByIdAndDelete(_id);

    // Fetching admin and customer users after deletion
    if (deletedUser) {
      const adminUsers = await Users.find({ role: { $in: adminRoles } }).select(
        "-password -movies"
      );

      const customerUsers = await Users.find({ role: "Customer" }).select(
        "-password"
      );

      res
        .status(200)
        .json({ message: "Deleted successfuly", adminUsers, customerUsers });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Exporting controller functions
module.exports = {
  login,
  logout,
  signup,
  refreshTokenHandler,
  getAllUsers,
  getAllUsersBasedOnRole,
  getUser,
  forgotPassword,
  resetPassword,
  addToWatchLater,
  getWatchLaterMovies,
  deleteWatchLaterMovie,
  deleteUser,
  updateUserStatus,
  verifyOTP,
};
