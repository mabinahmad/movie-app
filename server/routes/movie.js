const express = require("express");
const router = express.Router();
const Movies = require("../models/movieModel");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
//======================================================

// Set up Multer storage engine for Cloudinary
//------------------------------------------------
const storage = multer.memoryStorage(); // Multer will store the uploaded file in memory
const upload = multer({ storage: storage });

// Get all movies information
//=======================================================
router.get("/all", async (req, res) => {
  try {
    // Fetch all movies from the database
    const movieList = await Movies.find();

    res.status(200).json(movieList);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Get paginated movie list
//=======================================================
router.get("/", async (req, res) => {
  // Pagination parameters
  const { page, limit } = req.query;

  try {
    let skip = 0;
    if (page > 1) {
      skip = +limit * (page - 1);
    }
    // Fetch paginated movie list
    const movieList = await Movies.find()
      .populate("genres")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    // Count total number of movies
    const moviesCount = await Movies.countDocuments({});

    //Calculate pageCount
    const pageCount = Math.ceil(moviesCount / limit);

    res.status(200).json({ movies: movieList, moviesCount, pageCount });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get filtered movies
//=======================================================
router.get("/filtered-movies", async (req, res) => {
  try {
    // Extract query parameters
    const { genre, ratings, page, limit } = req.query;

    let filter = {};

    if (genre) {
      filter.genres = genre;
    }

    if (ratings) {
      const ratingsArray = ratings.split(",").map(Number);

      filter.ratings = {
        $in: ratingsArray,
      };
    }

    let skip = 0;
    if (page > 1) {
      skip = +limit * (page - 1);
    }

    const filteredMoviesCount = await Movies.countDocuments(filter);

    const filteredMoviesPageCount = Math.ceil(filteredMoviesCount / limit);

    const movies = await Movies.find(filter)
      .populate("genres")
      .skip(skip)
      .limit(Number(limit));

    if (movies.length === 0) {
      return res.status(200).json({
        message: "No movies found matching the filter criteria",
      });
    }

    res.status(200).json({
      movies: movies,
      moviesCount: filteredMoviesCount,
      pageCount: filteredMoviesPageCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search movies by title
//=======================================================
router.get("/moviesearch", async (req, res) => {
  const { query } = req.query;

  try {
    // Search movies by title using regex
    const movies = await Movies.find({
      title: {
        $regex: new RegExp(query, "i"),
      },
    }).populate("genres");

    if (movies.length === 0) {
      return res.status(200).json({
        message: "No movies found matching the filter criteria",
      });
    }

    res.status(200).json({ movies: movies });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get movie information for edit page
//=======================================================
router.get("/:movieId", async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movies.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//Create a new movie
//=======================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if the movie already exists
    const isExist = await Movies.findOne({
      title: req.body.title.toLowerCase(),
    });
    if (isExist) {
      return res.status(400).json({
        message: "Movie with this title already exists",
      });
    }
    const { title, ratings, length, genres } = req.body;
    const genreIds = JSON.parse(genres);
    const base64String = req.file.buffer.toString("base64");
    // Folder name in Cloudinary
    const folderName = "Movies Image";

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        folder: folderName,
      }
    );
console.log(result)
    if (!isExist) {
      // Create the new movie
      const createdMovie = await Movies.create({
        title: title,
        originalTitle: title,
        ratings: ratings,
        length: length,
        image: {
          publicId: result.public_id,
          secureUrl: result.secure_url,
        },
        genres: genreIds,
      });
      const allMoviesList = await Movies.find();
      return res.status(200).json(allMoviesList);
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Edit movie information
//=======================================================
router.put("/:movieId", upload.single("image"), async (req, res) => {
  //movieId
  //genreId
  try {
    const isExist = await Movies.findOne({ title: req.body.title });
    const { title, ratings, length, genres } = req.body;
    const genreIds = JSON.parse(genres);
    // Check if the movie exists
    const existingMovie = await Movies.findById(req.params.movieId);
    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // If image is being updated, upload it to Cloudinary
    let imageUrl = existingMovie.image.secureUrl;

    //Update movie details
    const fieldsToUpdate = {
      title,
      originalTitle: title,
      length,
      ratings,
      genres: genreIds,
    };

    if (req.file) {
      const base64String = req.file.buffer.toString("base64");
      // Folder name in Cloudinary
      const folderName = "Movies Image";

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${base64String}`,
        {
          folder: folderName,
        }
      );

      imageUrl = result.secure_url;
      // Delete existing image from Cloudinary if it's being replaced
      await cloudinary.uploader.destroy(existingMovie.image.publicId);

      // Update image details only if it's being replaced
      fieldsToUpdate.image = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };
    }

    const movie = await Movies.findByIdAndUpdate(
      req.params.movieId,

      {
        $set: fieldsToUpdate,
      },
      { new: true }
    );
    const moviesList = await Movies.find();
    return res.status(200).json(moviesList);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Function to delete an image from Cloudinary
//=======================================================
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return true; // Return true if deletion was successful
    } else {
      throw new Error("Failed to delete image from Cloudinary");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a movie
//=======================================================
router.delete("/", async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    const movie = await Movies.findById(_id);
    const publicId = movie.image.publicId;

    // Delete image from Cloudinary
    const deletedImage = await deleteImageFromCloudinary(publicId);

    if (!deletedImage) {
      return res
        .status(500)
        .json({ message: "Failed to delete image from Cloudinary" });
    }

    // Proceed to delete movie from database
    const deletedField = await Movies.findByIdAndDelete(_id);
    if (deletedField) {
      const allMovies = await Movies.find();
      return res.json(allMovies);
    }
    res.status(404).json({ message: "Item does not exist" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
