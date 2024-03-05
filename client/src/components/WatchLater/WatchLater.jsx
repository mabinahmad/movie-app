import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/MovieContext";
import { UserContext } from "../../context/UserContext";
import { MdDelete } from "react-icons/md";
import { ConfirmationModal } from "../../hooks/Modals/ConfirmationModal";
import Tooltip from "../../hooks/Tooltip/Tooltip";
import useToolTip from "../../hooks/Tooltip/useToolTip";
import "./WatchLater.css";
//===============================================================================
const API_MOVIE_WATCH_LATER = import.meta.env.VITE_API_MOVIE_WATCH_LATER;
//===============================================================================

// Component for managing watch later list
//--------------------------------------------------------------------------------
export const WatchLater = () => {
  const { genres } = useContext(MovieContext);
  const { setCurrentUser } = useContext(UserContext);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToolTip, hideToolTip, isTooltipVisible } = useToolTip();

  // Accessing user context to get current user information
  //------------------------------------------------------------------
  const {
    currentUser: { _id: userId, username },
  } = useContext(UserContext);

  // Extracting movie list and other details from watchLaterMovies state
  //------------------------------------------------------------------
  const myListMovies = watchLaterMovies.movies || [];
  const movieCount = myListMovies?.length || 0;
  const lastAddedMovieDate = watchLaterMovies.lastMovieAddedAt;
  const lastRemovedMovieDate = watchLaterMovies.lastMovieRemovedAt;

  const options = { year: "numeric", month: "long", day: "numeric" };

  // Function to format date
  //------------------------------------------------------------------
  const updatedDate = () => {
    const lastAddedAt = new Date(lastAddedMovieDate);
    const lastRemovedAt = lastRemovedMovieDate
      ? new Date(lastRemovedMovieDate)
      : null;

    const lastUpdatedOn =
      lastAddedAt > lastRemovedAt ? lastAddedAt : lastRemovedAt;

    const currentDate = new Date();

    // Check if the date is today
    //----------------------------
    if (
      lastUpdatedOn.getDate() === currentDate.getDate() &&
      lastUpdatedOn.getMonth() === currentDate.getMonth() &&
      lastUpdatedOn.getFullYear() === currentDate.getFullYear()
    ) {
      return "today";
    }
    return lastUpdatedOn.toLocaleDateString("en-US", options);
  };

  // Function to get genre titles from genre IDs
  //------------------------------------------------------------------
  const getGenreTitles = (genreIds) => {
    return genreIds.map((genreId) => {
      const genre = genres.find((genre) => genre._id === genreId);
      return genre ? genre.originalTitle : "";
    });
  };

  // Function to fetch watch later movies from the server
  //------------------------------------------------------------------
  const fetchWatchLaterMovies = async () => {
    try {
      setIsLoading(true);
      const response = await axios(`${API_MOVIE_WATCH_LATER}/${userId}`, {
        method: "GET",
      });
      setWatchLaterMovies(response.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a movie from the watch later list
  //------------------------------------------------------------------
  const deleteWatchLaterMovie = async (movieId) => {
    try {
      const response = await axios(`${API_MOVIE_WATCH_LATER}/${userId}`, {
        method: "DELETE",
        data: { movieId },
      });

      setWatchLaterMovies(response.data.watchlaterUpdation);
      setCurrentUser(response.data.currentUser);
    } catch (error) {}
  };

  // Event handler for delete button click
  //------------------------------------------------------------------
  const handleDeleteClick = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  // Event handler for canceling delete action
  //------------------------------------------------------------------
  const handleCancel = () => {
    setSelectedMovieId(null);
    setIsModalOpen(false);
  };

  // Event handler for confirming delete action
  //------------------------------------------------------------------
  const handleConfirm = () => {
    if (selectedMovieId) {
      deleteWatchLaterMovie(selectedMovieId);
      setSelectedMovieId(null);
      setIsModalOpen(false);
    }
  };

  // Fetch watch later movies when component mounts or userId changes
  //------------------------------------------------------------------
  useEffect(() => {
    if (userId) {
      fetchWatchLaterMovies();
    }
  }, [userId]);

  return (
    <div className="watch-later-container">
      <div className="watch-later">
        <div className="left">
          {myListMovies.length > 0 ? (
            <img src={myListMovies[0].image.secureUrl} alt="" />
          ) : (
            <img src="/left-background-watchlater.jpg" alt="" />
          )}

          <h1>Watch later</h1>
          <div className="details">
            <h2>{username}</h2>
            <div className="count-and-date">
              <span>{`${movieCount} movies`} </span>
              {lastAddedMovieDate || lastRemovedMovieDate ? (
                <span>{`Last updated on ${updatedDate()}`}</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div
          className={`right ${
            myListMovies.length === 0 ? "empty-watch-later" : ""
          }`}
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {myListMovies.length > 0 ? (
                myListMovies.map((movie, index) => (
                  <div key={movie._id}>
                    <div className="movie-card">
                      <div className="movie-length-image">
                        <img src={movie.image.secureUrl} alt="" />
                        <span className="movie-length">132 min</span>
                      </div>
                      <div className="title-genres">
                        <h2>{movie.originalTitle}</h2>
                        <span className="genre-text">
                          {getGenreTitles(movie.genres).join(" | ")}
                        </span>
                      </div>
                      <div className="delete-watch-later-button-container">
                        <MdDelete
                          onMouseOver={() => showToolTip(movie._id)}
                          onMouseOut={() => hideToolTip(movie._id)}
                          onClick={() => handleDeleteClick(movie._id)}
                          className="delete-watchlater-button"
                        />
                        <Tooltip isTooltipVisible={isTooltipVisible(movie._id)}>
                          Remove from watch later
                        </Tooltip>
                      </div>
                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onCancel={handleCancel}
                        onConfirm={handleConfirm}
                        movieId={selectedMovieId}
                      />
                    </div>
                    {index === myListMovies.length - 1 ? (
                      <hr className="hide-last-hr" />
                    ) : (
                      <hr />
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-watch-later-movies-page">
                  Your Watch Later list is empty. Start adding movies to enjoy
                  later!
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
