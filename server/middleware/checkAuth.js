const jwt = require("jsonwebtoken");

// Middleware function to check if the request is authenticated
exports.checkAuth = (req, res, next) => {
  try {
    // Extracting token from request headers
    const token = req.headers.authorization;

    // If token is not present, deny access
    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }

    // Verifying the validity of the token
    const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Storing user ID from the token in the request object
    req.userId = tokenValid._id;
    // Proceed to next middleware
    next();
  } catch (error) {
    // If token is invalid or verification fails, send Unauthorized response
    return res.status(401).json({
      message: "You are UnAutherized",
    });
  }
};
