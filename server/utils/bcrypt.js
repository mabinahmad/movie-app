const bcrypt = require("bcrypt");

// Salt factor for password hashing
const SALT = 10;

// Function to generate a password hash using bcrypt
const generatePasswordHash = (password) => {
  return bcrypt.hash(password, SALT);
};

// Function to compare a password with its hash using bcrypt
const comparePasswordHash = (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

module.exports = {
  generatePasswordHash,
  comparePasswordHash,
};
