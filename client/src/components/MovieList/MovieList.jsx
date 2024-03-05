import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MovieCard } from "../MovieCard/MovieCard";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import "./MovieList.css";
import { MovieContext } from "../../context/MovieContext";
import { Filter } from "../Filters/Filter";
import { FilterCategory } from "../Filters/FilterCategory";
import { useMediaQuery } from "react-responsive";
//==========================================================================

//================================================
// API endpoint for fetching movies
const API_MOVIES = import.meta.env.VITE_API_MOVIES;
//================================================

export const MovieList = () => {
  // Context variables
  //--------------------------------------------------------------
  const { searchMovieList, searchInputValue, isFilter, message, setMessage } =
    useContext(MovieContext);

  // State variables
  //--------------------------------------------------------------
  const [movies, setMovies] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [moviesCount, setMoviesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [genre, setGenre] = useState("");
  const [ratings, setRatings] = useState([]);

  //Viewport
  //--------------------------------------------------------------
  const isMobileView = useMediaQuery({ maxWidth: 414 });
  const isTabletView = useMediaQuery({ maxWidth: 1200 });

  // Function to fetch movies from API
  //--------------------------------------------------------------
  const fetchMovies = async () => {
    try {
      // const response = await axios(API_MOVIES, {
      //   params: {
      //     page: currentPage,
      //     limit: limit,
      //   },
      // });
      const response = await axios(
        `${API_MOVIES}?page=${currentPage}&limit=${limit}`
      );

      setMovies(response.data.movies);
      setPageCount(response.data.pageCount);
      setMoviesCount(response.data.moviesCount);

      setGenre("");
    } catch (error) {}
  };

  // Function to fetch filtered movies based on genre and ratings
  //--------------------------------------------------------------
  const fetchFilteredMovies = async () => {
    try {
      const response = await axios(`${API_MOVIES}/filtered-movies`, {
        params: { genre, ratings: ratings.join(","), page: currentPage, limit },
      });

      setMovies(response.data.movies);
      setPageCount(response.data.pageCount);
      setMoviesCount(response.data.moviesCount);
      setMessage(response.data.message);
    } catch (error) {}
  };

  //To fetch movies when component mounts or dependencies change
  //--------------------------------------------------------------
  useEffect(() => {
    if (genre || ratings) {
      fetchFilteredMovies();
    } else {
      fetchMovies();
    }
  }, [currentPage, limit, genre, ratings]);

  // Functions for pagination
  //------------------------------------------------
  const handleNextPage = () => {
    if (!(currentPage === pageCount)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleFirstPageButton = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const handleLastPageButton = () => {
    if (!(currentPage === pageCount)) {
      setCurrentPage(pageCount);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit) => {
    setLimit(limit);
  };
  //------------------------------------------------

  return (
    <div className="movie-list-wrapper">
      {isFilter && isTabletView && !searchInputValue && (
        <Filter
          genre={genre}
          setGenre={setGenre}
          setRatings={setRatings}
          ratings={ratings}
        />
      )}
      {isMobileView || isTabletView ? (
        <FilterCategory genre={genre} setGenre={setGenre} />
      ) : (
        !searchInputValue && (
          <Filter
            genre={genre}
            setGenre={setGenre}
            setRatings={setRatings}
            ratings={ratings}
          />
        )
      )}

      <div className="movie-list-and-pagination-container">
        <div className="movie-list-container">
          <div className={`movie-list ${isFilter && "increase-padding-top"}`}>
            {searchInputValue && searchMovieList !== "undefined" ? (
              Array.isArray(searchMovieList) && searchMovieList.length > 0 ? (
                searchMovieList.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))
              ) : (
                <p className="filter-message-text">{message}</p>
              )
            ) : movies && movies.length > 0 ? (
              movies?.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p className="filter-message-text">{message}</p>
            )}
          </div>
        </div>
        <div className="pagination-control-container">
          <div className="pagination-control">
            <div className="left-control">
              <span>Items per page</span>
              <select
                name=""
                id=""
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
              <span>
                1-{limit} of {moviesCount} items
              </span>
            </div>
            <div className="right-control">
              <div className="previous-controls">
                <span
                  className={`navigate-to-first-page ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={handleFirstPageButton}
                >
                  <MdKeyboardDoubleArrowLeft className="pagination-icon double-icon" />
                </span>

                <div
                  className={`previous-icon ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={handlePrevPage}
                >
                  <span>
                    <MdKeyboardArrowLeft className="pagination-icon" />
                  </span>
                  <span className="previous-icon-text">Previous</span>
                </div>
              </div>

              <select
                name=""
                id=""
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
              >
                {(() => {
                  const options = [];
                  for (let i = 1; i <= pageCount; i++) {
                    options.push(
                      <option key={i} value={i}>
                        {i}
                      </option>
                    );
                  }
                  return options;
                })()}
                {/* <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option> */}
              </select>
              <span className="total-page-count">{`of ${pageCount}`}</span>
              <div className="next-controls">
                <div
                  className={`next-icon ${
                    currentPage === pageCount ? "disabled" : ""
                  }`}
                  onClick={handleNextPage}
                >
                  <span className="next-icon-text">Next</span>
                  <span>
                    <MdKeyboardArrowRight className="pagination-icon" />
                  </span>
                </div>
                <span
                  className={`navigate-to-last-page ${
                    currentPage === pageCount ? "disabled" : ""
                  }`}
                  onClick={handleLastPageButton}
                >
                  <MdKeyboardDoubleArrowRight className="pagination-icon double-icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
