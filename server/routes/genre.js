const express = require("express");
const router = express.Router();
const Genres = require("../models/genreModel");
//===============================================

// Get all genres information
//=========================================================================
router.get("/", async (req, res) => {
  try {
    const genreList = await Genres.find();
    res.status(200).json(genreList);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Create a new genre
//=========================================================================
router.post("/", async (req, res) => {
  try {
    // Checking if the genre already exists
    const isExist = await Genres.findOne({
      title: req.body.title.toLowerCase(),
    });
    const { title } = req.body;
    if (!isExist) {
      // Creating the new genre
      const createdGenre = await Genres.create({
        title: title,
        originalTitle: title,
      });

      // Fetching all genres after creation
      const allGenres = await Genres.find();

      return res.status(200).json(allGenres);
    }

    // If genre already exists, send error response
    return res.status(400).json({
      message: "Genre with this title already exist",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Edit genre information
//=========================================================================
router.put("/", async (req, res) => {
  try {
    const { _id, title } = req.body;
    const fieldsToUpdate = { title, originalTitle: title };
    // Updating genre information
    const updatedData = await Genres.findByIdAndUpdate(_id, fieldsToUpdate, {
      new: true,
    });
    if (updatedData) {
      // Fetching all genres after updation
      const allGenres = await Genres.find();
      return res.json(allGenres);
    }

    // If genre does not exist, send error response
    res.status(404).json({
      message: `Item with id :${_id} does not exist`,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

// Delete a genre
//=========================================================================
router.delete("/", async (req, res) => {
  try {
    const { _id } = req.body;
    // Deleting the genre by ID
    const deletedField = await Genres.findByIdAndDelete(_id);

    if (deletedField) {
      const allGenres = await Genres.find();
      return res.json(allGenres);
    }

    // If genre does not exist, send error response
    res.status(404).json({ message: "Item does not exist" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
