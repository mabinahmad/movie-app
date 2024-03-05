import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MovieContext } from "../../../context/MovieContext";
import { ConfirmationModal } from "../../../utils/Modals/ConfirmationModal";
import "./GenreList.css";
//============================================================

//=================================================
const API_GENRES = import.meta.env.VITE_API_GENRES;
//=================================================
export const GenreList = () => {
  const { genres, setGenres } = useContext(MovieContext);

  // State variables for confirmation modal
  //----------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  const navigate = useNavigate();

  // Function to handle genre deletion
  //------------------------------------------------
  const handleGenreDelete = async (_id) => {
    try {
      const response = await axios(API_GENRES, {
        method: "DELETE",
        data: {
          _id: _id,
        },
      });
      setGenres(response.data);
    } catch (error) {
      toast.error(error.response?.data.message, {
        icon: true,
      });
      console.log(error.response.data.message);
    }
  };

  // Function to handle click on delete button
  //----------------------------------------------------
  const handleDeleteClick = (genreId) => {
    setSelectedGenreId(genreId);
    setIsModalOpen(true);
  };

  // Function to handle cancellation of modal
  //----------------------------------------------------
  const handleCancel = () => {
    setSelectedGenreId(null);
    setIsModalOpen(false);
  };

  // Function to handle confirmation of modal
  //----------------------------------------------------
  const handleConfirm = () => {
    if (selectedGenreId) {
      handleGenreDelete(selectedGenreId);
      setSelectedGenreId(null);
      setIsModalOpen(false);
    }
  };

  // Function to navigate to genre editing page
  //------------------------------------------------
  const openGenreEditPage = (genre) => {
    navigate(`/genre-edit/${genre._id}`);
  };

  // Function to navigate to genre creation page
  //------------------------------------------------
  const goToGenrePage = () => {
    navigate("/genre-create");
  };

  return (
    <div className="all-genres-list-container">
      <div className="genres-list">
        <div className="allgenres-text-and-genre-add-button">
          <h1>All Genres</h1>
          <button className="genre-add-button" onClick={goToGenrePage}>
            Add Genre
          </button>
        </div>
        <div className="genres-table-container">
          <table className="genres-table">
            <thead className="genres-table-header">
              <tr>
                <th>No</th>
                <th>Title</th>
                <th className="genres-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre, index) => (
                <tr key={genre._id}>
                  <td>{index + 1}</td>
                  <td>{genre.originalTitle}</td>
                  <td>
                    <button
                      onClick={() => openGenreEditPage(genre)}
                      className="button-edit"
                      style={{ marginRight: "20px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(genre._id)}
                      className="button-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            id={selectedGenreId}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
