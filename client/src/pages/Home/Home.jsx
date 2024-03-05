import React from "react";
import { MovieList } from "../../components/MovieList/MovieList";
import "./Home.css";
//==================================================================

export const Home = () => {
  return (
    <div className="home">
      <MovieList />
    </div>
  );
};
