import axios from "axios";
import React, { useEffect, useState } from "react";

import { EditGenre } from "../../components/Genre/GenreEdit/EditGenre";
import "./GenreEdit.css";

export const GenreEdit = () => {
  return (
    <div className="genre-edit-page">
  
      <EditGenre />
    </div>
  );
};
