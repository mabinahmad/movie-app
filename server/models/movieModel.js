const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, "Movie name must be at least 2 characters long"],
      maxLength: 250,
      required: [true, "Movie name  cannot be empty"],
      lowercase: true,
    },
    originalTitle: {
      // Stores the original casing of the movie title for frontend display
      type: String,
      trim: true,
      maxLength: 250,
    },
    image: {
      publicId: { type: String, required: true },
      secureUrl: { type: String, required: true },
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    length: {
      type: Number,
      trim: true,
      required: [true, "Please enter the field"],
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genres",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Movies", movieSchema);
