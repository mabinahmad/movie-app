import { createContext, useEffect, useState } from "react";
import axios from "axios";
//===========================================================

// Create a context for managing movie-related data
export const MovieContext = createContext();

// API URLs for fetching movies and genres
//==========================================================
const API_ALL_MOVIES = import.meta.env.VITE_API_ALL_MOVIES;
const API_GENRES = import.meta.env.VITE_API_GENRES;
//==========================================================

export const MovieProvider = ({ children }) => {
  // State variables for managing movies, genres, and sidebar visibility
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Function to fetch the list of movies from the API
  const fetchMovieList = async () => {
    try {
      const response = await axios(API_ALL_MOVIES);
      setMovies(response.data);
    } catch (error) {}
  };

  // Function to fetch the list of genres from the API
  const fetchGenres = async () => {
    try {
      const response = await axios(API_GENRES);
      setGenres(response.data);
    } catch (error) {}
  };

  // useEffect hook to fetch movie list and genres when the component mounts
  useEffect(() => {
    fetchMovieList();
    fetchGenres();
  }, []);

  // Provide movie-related data to components via context
  return (
    <MovieContext.Provider
      value={{
        movies,
        genres,
        setGenres,
        setMovies,
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
