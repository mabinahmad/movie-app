import React from "react";
import { MovieList } from "../../components/Movie/MovieList/MovieList";
import "./Movies.css";

export const Movies = () => {
  return (
    <div className="movies-page">
      <MovieList />
    </div>
  );
};
