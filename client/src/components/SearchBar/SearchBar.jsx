import React, { useContext, useState } from "react";
import "./SearchBar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { MovieContext } from "../../context/MovieContext";
//==============================================================

export const SearchBar = () => {
  // Accessing search input value and related functions from context
  //------------------------------------------------------------------
  const { searchInputValue, handleChange, clearInput } =
    useContext(MovieContext);

  return (
    <div className="search-bar">
      <div className="search-container">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          value={searchInputValue}
          onChange={handleChange}
          className="search-input"
          placeholder="Search here"
        />

        {searchInputValue && (
          <IoMdClose onClick={clearInput} className="search-clear-icon" />
        )}
      </div>
    </div>
  );
};
