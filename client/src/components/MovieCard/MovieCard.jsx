import React, { useContext, useEffect, useState } from "react";
import "./MovieCard.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdOutlineAddToPhotos } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Tooltip from "../../hooks/Tooltip/Tooltip";
import useToolTip from "../../hooks/Tooltip/useToolTip";
//======================================================================

// API endpoint from .env file
//======================================================================
const API_MOVIE_WATCH_LATER = import.meta.env.VITE_API_MOVIE_WATCH_LATER;
//======================================================================

export const MovieCard = ({ movie }) => {
  //States and hooks
  //---------------------------------------------------------------------
  const {
    currentUser: { _id: userId },
    setCurrentUser,
  } = useContext(UserContext);
  const [isAdded, setIsAdded] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("Save to Watch Later");
  const { showToolTip, hideToolTip, isTooltipVisible } = useToolTip();
  const genres = movie.genres;

  // Function to get genre titles from movie data
  //---------------------------------------------------------------------
  const getGenreTitles = () => {
    return genres.map((genre) => genre.originalTitle);
  };

  // Function to check if the movie is added to watch later list
  //---------------------------------------------------------------------
  const checkIfMovieIsAdded = async (movieId) => {
    try {
      const response = await axios(`${API_MOVIE_WATCH_LATER}/${userId}`);
      const watchLaterMovies = response.data.movies;

      const isMovieAdded = watchLaterMovies.some(
        (watchLaterMovie) => watchLaterMovie._id === movieId
      );
      setIsAdded(isMovieAdded);
      setTooltipContent(
        isMovieAdded ? "Added to Watch Later" : "Save to Watch Later"
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (userId) {
      checkIfMovieIsAdded(movie._id);
    }
  }, [userId, movie._id]);

  // Function to handle adding the movie to watch later list
  //---------------------------------------------------------------------
  const handleAddWatchLater = async (movieId) => {
    try {
      const response = await axios(`${API_MOVIE_WATCH_LATER}/${userId}`, {
        method: "PUT",
        data: { movieId },
      });
      setIsAdded(true);
      setCurrentUser(response.data);
      setTooltipContent("Added to Watch Later");
    } catch (error) {}
  };

  return (
    <div className="movie-card">
      <div className="movie-image">
        <img src={movie.image.secureUrl} alt="" />
      </div>
      <div className="movie-details">
        <span className="movie-length">{movie.length} min</span>
        <div className="star-and-rating">
          <span>{`${movie.ratings}.0`} </span>
          <FaStar className="star-rating" />
        </div>
        <h3>{movie.originalTitle}</h3>
        <span className="genre-text">{getGenreTitles().join(" | ")}</span>
        <div className="watch-later-button">
          <MdOutlineAddToPhotos
            onMouseOver={() => showToolTip(movie._id)}
            onMouseOut={() => hideToolTip(movie._id)}
            onClick={() => handleAddWatchLater(movie._id)}
            className={`watch-later-icon ${isAdded ? "added" : ""}`}
          />
          <Tooltip isTooltipVisible={isTooltipVisible(movie._id)}>
            {tooltipContent}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
