import React, { useContext, useState } from "react";
import { MovieContext } from "../../../context/MovieContext";
import { ToastContainer, toast } from "react-toastify";
import { StarRating } from "./StarRating";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MovieList.css";
import { ConfirmationModal } from "../../../utils/Modals/ConfirmationModal";
//==============================================================

//==================================================
const API_MOVIES = import.meta.env.VITE_API_MOVIES;
//==================================================

// Functional component for rendering the list of movies
//-------------------------------------------------------
export const MovieList = () => {
  // Accessing movie context for data and function
  const { movies, genres, setMovies } = useContext(MovieContext);

  // State variables for confirmation modal
  //----------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  // Function to get genre titles based on genre IDs
  //--------------------------------------------------
  const getGenreTitles = (genreIds) => {
    return genreIds.map((genreId) => {
      const genre = genres.find((genre) => genre._id === genreId);
      return genre && genre.originalTitle;
    });
  };

  // Function to handle movie deletion
  //--------------------------------------------------
  const handleMovieDelete = async (_id) => {
    // Sending DELETE request to the API endpoint
    try {
      const response = await axios(API_MOVIES, {
        method: "DELETE",
        data: {
          _id: _id,
        },
      });

      // Updating movie list after deletion
      setMovies(response.data);
    } catch (error) {
      toast.error(error.response?.data.message, {
        icon: true,
      });
    }
  };

  // Function to handle click on delete button
  //----------------------------------------------------
  const handleDeleteClick = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  // Function to handle cancellation of modal
  //----------------------------------------------------
  const handleCancel = () => {
    setSelectedMovieId(null);
    setIsModalOpen(false);
  };

  // Function to handle confirmation of modal
  //----------------------------------------------------
  const handleConfirm = () => {
    if (selectedMovieId) {
      handleMovieDelete(selectedMovieId);
      setSelectedMovieId(null);
      setIsModalOpen(false);
    }
  };

  // Function to navigate to the movie edit page
  //--------------------------------------------------
  const openEditMoviePage = (movieId) => {
    navigate(`/movie-edit/${movieId}`);
  };

  // Function to navigate to the add movie page
  //--------------------------------------------------
  const addMoviePage = () => {
    navigate("/movie-create");
  };

  return (
    <div className="container">
      <div className="allmovies-text-and-add-movie-button">
        <h1>All Movies</h1>
        <button className="add-movie-button" onClick={addMoviePage}>
          Add Movie
        </button>
      </div>
      <div className="movie-list-container">
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image?.secureUrl} alt="" />
              </div>

              <div className="movie-details">
                <h3>{movie.originalTitle}</h3>
                <span className="genre-text">
                  {getGenreTitles(movie.genres).join(" | ")}
                </span>

                <div className="star-and-buttons">
                  <span>
                    <StarRating
                      className="star-rating"
                      rating={movie.ratings}
                    />
                  </span>
                  <div className="buttons">
                    <button
                      onClick={() => openEditMoviePage(movie._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(movie._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Confirmation modal for movie deletion */}
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            id={selectedMovieId}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
