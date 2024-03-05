const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 20,
    required: true,
    unique: true,
    lowercase: true,
    // required: [true, "Name Cannot be empty."],
    // unique: [true, "No duplicate values allowed"]
  },
  originalTitle: {
    // Stores the original casing of the genre title for frontend display
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 20,
    required: true,
  },
});
module.exports = mongoose.model("Genres", genreSchema);
