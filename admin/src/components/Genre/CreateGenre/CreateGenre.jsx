import React, { useContext, useState } from "react";
import axios from "axios";
import { MovieContext } from "../../../context/MovieContext";
import { toast, ToastContainer } from "react-toastify";
import "./CreateGenre.css";
//===============================================================

//===================================================
// API endpoint for genres
const API_GENRES = import.meta.env.VITE_API_GENRES;
//===================================================

// CreateGenre component for creating a new genre
export const CreateGenre = () => {
  // State to hold the genre input value
  //-------------------------------------------------
  const [genre, setGenre] = useState("");

  const [genreError, setGenreError] = useState("");

  // Access the movie context to update genres
  //-------------------------------------------------
  const { setGenres } = useContext(MovieContext);

  // Handler for input change
  //-------------------------------------------------
  const handleChange = (event) => {
    setGenre(event.target.value);
    genreValidation(event.target.value);
  };

  // Function to handle onBlur event
  //------------------------------------------------
  const handleBlur = (event) => {
    const { value } = event.target;
    genreValidation(value);
  };

  const genreValidation = (value) => {
    if (value.length === 0) {
      setGenreError("Genre field cannot be empty");
    } else if (value.length < 2) {
      setGenreError("Genre must be at least 2 characters long");
    } else {
      setGenreError("");
    }
  };

  // Handler for form submission
  //-------------------------------------------------
  const handleGenreFormSubmit = (event) => {
    event.preventDefault();
    if (genre.length === 0) {
      setGenreError("Genre field cannot be empty");
    } else if (genre.length < 2) {
      setGenreError("Genre must be at least 2 characters long");
      return;
    } else {
      setGenreError("");
    }
    createGenre(genre);
    clearInput();
  };

  // Function to clear input field
  //-------------------------------------------------
  const clearInput = () => {
    setGenre("");
  };

  // Function to create a new genre
  //-------------------------------------------------
  const createGenre = async (genre) => {
    try {
      const response = await axios(API_GENRES, {
        method: "POST",
        data: {
          title: genre,
        },
      });
      // Update genres context with the new genre
      setGenres(response.data);
      toast.success("Successfuly created");
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="genre-create">
      <h2>Create Genre</h2>
      <form onSubmit={handleGenreFormSubmit}>
        <div className="title-container">
          <label>Title</label>
          <input
            type="text"
            value={genre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter genre"
            required
            maxLength={20}
          />
          {genreError && <div className="error-message">{genreError}</div>}
        </div>

        <button type="submit">Create</button>
      </form>
      <ToastContainer />
    </div>
  );
};
