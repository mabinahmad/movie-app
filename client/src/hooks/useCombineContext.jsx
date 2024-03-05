import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { MovieContext } from "../context/MovieContext";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";

export const useCombineContext = () => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const movieContext = useContext(MovieContext);

  return {
    authContext,
    userContext,
    themeContext,
    movieContext,
  };
};
