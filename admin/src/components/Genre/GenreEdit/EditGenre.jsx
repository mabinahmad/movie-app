import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MovieContext } from "../../../context/MovieContext";
import "./EditGenre.css";
//============================================================

//API endpoint for genres
//=================================================
const API_GENRES = import.meta.env.VITE_API_GENRES;
//=================================================

//EditGenre component
//-------------------------------------------------------------
export const EditGenre = () => {
  // Retrieve the genreId from the URL parameters
  const { genreId } = useParams();
  const { genres, setGenres } = useContext(MovieContext);
  const [genreError, setGenreError] = useState("");
  const navigate = useNavigate();

  // Find the genre object based on the genreId
  //------------------------------------------------
  const genre = genres.find((genre) => genre._id === genreId) || {};

  const [newGenre, setNewGenre] = useState(genre.originalTitle);

  // Function to handle genre editing
  //------------------------------------------------
  const handleGenreEdit = async (newGenre) => {
    try {
      const response = await axios(API_GENRES, {
        method: "PUT",
        data: {
          _id: genre._id,
          title: newGenre,
        },
      });
      setGenres(response.data);
    } catch (error) {}
  };

  // Function to handle changes in the genre title input
  //------------------------------------------------
  const handleChange = (event) => {
    setNewGenre(event.target.value);
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

  // Function to handle form submission
  //------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    if (newGenre.length === 0) {
      setGenreError("Genre field cannot be empty");
    } else if (newGenre.length < 2) {
      setGenreError("Genre must be at least 2 characters long");
      return;
    } else {
      setGenreError("");
    }

    handleGenreEdit(newGenre);
    navigate("/genres");
  };

  // Function to handle canceling genre editing
  //------------------------------------------------
  const handleCancelGenreEdit = () => {
    navigate("/genres");
  };

  // Render the EditGenre component UI
  //-------------------------------------------------------------
  return (
    <div className="genre-edit">
      <h2>Edit Genre</h2>
      <form onSubmit={handleSubmit}>
        <div className="title-container">
          <label>Title</label>
          <input
            type="text"
            value={newGenre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter genre"
            required
            // minLength={2}
            maxLength={20}
          />
          {genreError && <div className="error-message">{genreError}</div>}
        </div>
        <div className="genre-edit-buttons">
          <button type="submit" className="genre-submit-button">
            Update
          </button>{" "}
          <button
            onClick={handleCancelGenreEdit}
            className="genre-cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
