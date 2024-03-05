import React, { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/MovieContext";
import { FaStar } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import "./Filter.css";
import { ThemeContext } from "../../context/ThemeContext";
//===============================================================================

export const Filter = ({ genre, setGenre, ratings, setRatings }) => {
  const { genres, searchInputValue, isFilter } = useContext(MovieContext);
  const { isLightMode } = useContext(ThemeContext);
  //Checking for  viewport using useMediaQuery hook
  //-------------------------------------------------------------------------------
  const isTabletView = useMediaQuery({ maxWidth: 1200 });

  // Function to find the title of a genre based on its ID
  //-------------------------------------------------------------------------------
  const findGenreTitle = (genreId) => {
    const genreFound = genres.find((genre) => genre._id === String(genreId));
    return genreFound ? genreFound.originalTitle : "";
  };

  // Event handler for changing the selected genre
  //-------------------------------------------------------------------------------
  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  // Function to clear the selected genre
  //-------------------------------------------------------------------------------
  const clearGenre = () => {
    setGenre("");
  };

  // Event handler for changing the selected ratings
  //-------------------------------------------------------------------------------
  const handleRatingChange = (rating) => {
    setRatings((prevRatings) => {
      const updatedRatings = prevRatings.includes(rating)
        ? prevRatings.filter((prevRating) => prevRating !== rating)
        : [...prevRatings, rating];

      return updatedRatings;
    });
  };

  // Function to clear all filters
  //-------------------------------------------------------------------------------
  const clearFilters = () => {
    setGenre("");
    setRatings([]);
  };

  useEffect(() => {
    if (searchInputValue && (genre || ratings.length > 0)) {
      clearFilters();
    }
  }, [searchInputValue]);

  // Function for clearing a specific rating
  //-------------------------------------------------------------------------------
  const handleRatingClear = (rating) => {
    setRatings((prevRatings) => {
      const updatedRatings = prevRatings.filter(
        (prevRating) => prevRating !== rating
      );
      return updatedRatings;
    });
  };

  // Rendering component
  //-------------------------------------------------------------------------------
  return (
    <div
      className={`filter-container ${
        isTabletView && isFilter ? "tablet" : ""
      } ${isLightMode ? "light-mode" : ""}`}
    >
      <div className="filters">
        <div className="filter-title-clear-button">
          <h3>FILTERS</h3>
          {(ratings?.length !== 0 || genre) && (
            <span onClick={clearFilters} className="filter-clear-button">
              CLEAR ALL
            </span>
          )}
        </div>
        <div className="filters-items">
          {genre ? (
            <span className="clear-icon-text" onClick={clearGenre}>
              <MdClear />
              <span>{findGenreTitle(genre)}</span>
            </span>
          ) : (
            ""
          )}
          {ratings?.length !== 0 &&
            ratings?.map((rating) => (
              <span
                className="clear-icon-text"
                key={rating}
                onClick={() => handleRatingClear(rating)}
              >
                <MdClear />
                <span>
                  {rating} <FaStar className="filter-rating-icon" />
                </span>
              </span>
            ))}
        </div>
      </div>

      <div className="genre-filter">
        <h3>GENRES</h3>
        <select name="" onChange={handleGenreChange} value={genre}>
          <option value="">Select Genre</option>
          {genres?.map((genre) => (
            <option value={genre._id} key={genre._id}>
              {genre.originalTitle}
            </option>
          ))}
        </select>
      </div>
      <div className="ratings-filter">
        <h3>CUSTOMER RATINGS</h3>

        <div className="ratings-checkboxes">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="rating-item">
              <input
                type="checkbox"
                value={rating}
                onChange={() => handleRatingChange(rating)}
                checked={ratings?.includes(rating)}
              />
              <span className="rating-text">{rating}</span>
              <FaStar className="filter-rating-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
