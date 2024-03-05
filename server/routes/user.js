const express = require("express");
const {
  login,
  signup,
  refreshTokenHandler,
  logout,
  getAllUsers,
  getAllUsersBasedOnRole,
  getUser,
  forgotPassword,
  resetPassword,
  addToWatchLater,
  getWatchLaterMovies,
  deleteUser,
  deleteWatchLaterMovie,
  updateUserStatus,
  verifyOTP,
} = require("../controllers/userController");
const { checkAuth } = require("../middleware/checkAuth");
const router = express.Router();

// /API routes for user-related operations
//=========================================================
router.get("/", getAllUsers);
router.get("/separate-users", getAllUsersBasedOnRole);
router.get("/user", checkAuth, getUser);
router.get("/users");
router.post("/signup", signup);
router.delete("/delete-user", deleteUser);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/refresh-token", refreshTokenHandler);
router.get("/logout", logout);
router.put("/watchlater/:userId", addToWatchLater);
router.get("/watchlater/:userId", getWatchLaterMovies);
router.delete("/watchlater/:userId", deleteWatchLaterMovie);
router.patch("/status/:userId", updateUserStatus);
module.exports = router;
