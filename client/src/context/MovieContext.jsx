import { createContext } from "react";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const MovieContext = createContext();

// API URL for movies and genres
//========================================================
const API_ALL_MOVIES = import.meta.env.VITE_API_ALL_MOVIES;
const API_MOVIES_SEARCH = import.meta.env.VITE_API_MOVIES_SEARCH;
const API_GENRES = import.meta.env.VITE_API_GENRES;
//========================================================

export const MovieProvider = ({ children }) => {
  // States to store the list of all movies and genres
  //---------------------------------------------------------------------------------
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  // States to manage the search input value and store the resulting movie list
  //---------------------------------------------------------------------------------
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchMovieList, setSearchMovieList] = useState([]);

  // Fetch all movies data from the API
  //---------------------------------------------------------------------------------
  const fetchAllMovieList = async () => {
    try {
      const response = await axios(API_ALL_MOVIES);
      setMovies(response.data);
    } catch (error) {}
  };

  // Fetch all genres data
  //---------------------------------------------------------------------------------
  const fetchAllGenres = async () => {
    try {
      const response = await axios(API_GENRES);
      setGenres(response.data);
    } catch (error) {}
  };

  //=================================================================================

  // HandleChange function to update the search input value
  //---------------------------------------------------------------------------------
  const handleChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  //Function for Fetch movie data from the API
  //---------------------------------------------------------------------------------
  const fetchSearchedMovies = async () => {
    try {
      const response = await axios(API_MOVIES_SEARCH, {
        params: {
          query: searchInputValue,
        },
      });
      setSearchMovieList(response.data.movies);

      setMessage(response.data.message);
    } catch (error) {}
  };

  // Clear function to reset the search input and result list
  //---------------------------------------------------------------------------------
  const clearInput = () => {
    setSearchInputValue("");
    setSearchMovieList([]);
  };

  // useEffect with a dependency array to debounce the API request
  //---------------------------------------------------------------------------------
  useEffect(() => {
    fetchAllMovieList();
    fetchAllGenres();
    const timeout = setTimeout(() => {
      if (searchInputValue) {
        // Call the fetchSearchedMovieList function after a 500ms delay
        fetchSearchedMovies();
      }
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or the dependency changes
    return () => {
      clearTimeout(timeout);
    };
  }, [searchInputValue]); // Only re-run this effect when searchInputValue changes

  //=================================================================================
  return (
    <MovieContext.Provider
      value={{
        movies,
        isFilter,
        setIsFilter,
        genres,
        message,
        setMessage,
        searchInputValue,
        searchMovieList,
        clearInput,
        handleChange,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
