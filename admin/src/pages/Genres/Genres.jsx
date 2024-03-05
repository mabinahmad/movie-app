import React from "react";
import { GenreList } from "../../components/Genre/GenreList/GenreList";
import "./Genres.css";

export const Genres = () => {
  return (
    <div className="genres-page">
      <GenreList />
    </div>
  );
};
