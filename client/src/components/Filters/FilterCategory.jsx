import React, { useContext, useState } from "react";
import { MovieContext } from "../../context/MovieContext";
import "./FilterCategory.css";
//===============================================================

export const FilterCategory = ({ setGenre }) => {
  // Accessing genres from MovieContext using useContext hook
  //-------------------------------------------------------------
  const { genres } = useContext(MovieContext);

  // State to track the active genre
  const [activeGenre, setActiveGenre] = useState("");

  // Function to handle genre change when clicked
  //-------------------------------------------------------------
  const handleGenreChange = (genreId) => {
    setGenre(genreId);
    setActiveGenre(genreId);
  };

  //Function for clear filter and display all movies
  //-------------------------------------------------------------
  const handleClearGenreFilter = () => {
    setGenre("");
    setActiveGenre("");
  };

  return (
    <div className="filter-category">
      <span
        onClick={handleClearGenreFilter}
        className={`category-name ${activeGenre === "" && "active"}`}
      >
        All
      </span>
      {genres.map((genre) => (
        <span
          onClick={() => handleGenreChange(genre._id)}
          key={genre._id}
          className={`category-name ${activeGenre === genre._id && "active"}`}
        >
          {genre.originalTitle}
        </span>
      ))}
    </div>
  );
};
