const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      //  minLength: 4,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },

    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }],

    lastMovieAddedAt: {
      type: Date,
    },
    lastMovieRemovedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Conditional schema based on the user's role
userSchema.pre("save", function (next) {
  const excludedRoles = [
    "super admin",
    "user administrator",
    "content administrator",
  ];
  if (excludedRoles.includes(this.role.toLowerCase())) {
    // Exclude movies field for admin users
    this.movies = undefined;
  }

  next();
});

module.exports = { Users: mongoose.model("Users", userSchema) };
