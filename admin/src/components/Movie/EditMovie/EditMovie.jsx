import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./EditMovie.css";
import axios from "axios";
import { MovieContext } from "../../../context/MovieContext";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//============================================================

//==================================================
const API_MOVIES = import.meta.env.VITE_API_MOVIES;
//==================================================

//EditMovie Component
//-------------------------------------------------------------
export const EditMovie = () => {
  const { genres, setMovies } = useContext(MovieContext);
  // State variable to hold the image preview URL
  const [previewImage, setPreviewImage] = useState(null);

  const [fields, setFields] = useState({
    title: "",
    ratings: 0,
    length: "",
    image: null,
    genres: [],
  });

  // State for new user  error fields
  //----------------------------------------------------
  const [errorFields, setErrorFields] = useState({
    title: false,
    ratings: false,
    length: false,
    genres: false,
    image: false,
  });

  // URL parameters
  const { movieId } = useParams();

  const navigate = useNavigate();

  // Function to fetch movie details
  //-------------------------------------------
  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_MOVIES}/${movieId}`);
      const movieData = response.data;

      setFields({
        title: movieData.originalTitle,
        ratings: movieData.ratings,
        length: movieData.length,
        genres: movieData.genres,
        image: movieData.image,
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  // Function to handle input change
  //-------------------------------------------
  const handleInputChange = (event) => {
    setFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Function to handle file change
  //-------------------------------------------
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFields((prev) => ({
      ...prev,
      image: selectedFile,
    }));

    // Preview image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  // Function to handle genre change
  //-------------------------------------------
  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    setFields((prev) => {
      let updatedGenres;
      if (event.target.checked) {
        if (!prev.genres.includes(selectedGenre)) {
          updatedGenres = [...prev.genres, selectedGenre];
        } else {
          updatedGenres = [...prev.genres];
        }
      } else {
        updatedGenres = prev.genres.filter((genre) => genre !== selectedGenre);
      }
      return {
        ...prev,
        genres: updatedGenres,
      };
    });
  };

  // Form validation function
  //----------------------------------------------------
  const formValidationOnSubmit = () => {
    const errors = {
      title: false,
      ratings: false,
      length: false,
      genres: false,
      image: false,
    };

    if (fields.title === "" || fields.title.length < 2) {
      errors.title = true;
    }
    if (fields.ratings === 0) {
      errors.ratings = true;
    }
    if (fields.length === "" || !/^[1-9][0-9]*$/.test(fields.length)) {
      errors.length = true;
    }
    if (fields.genres.length === 0) {
      errors.genres = true;
    }
    if (fields.image === null) {
      errors.image = true;
    }
    setErrorFields(errors);
    if (Object.values(errors).some((error) => error === true)) {
      return false;
    }
    return true;
  };

  // Function to handle validation of specific form fields based on the field name
  //-----------------------------------------------------------------------------
  const handleFieldValidation = (fieldName) => {
    switch (fieldName) {
      case "title":
        if (fields.title === "" || fields.title.length < 2) {
          setErrorFields((prev) => ({
            ...prev,
            title: true,
          }));
        } else {
          setErrorFields((prev) => ({
            ...prev,
            title: false,
          }));
        }
        break;

      case "image":
        if (fields.image === null) {
          setErrorFields((prev) => ({
            ...prev,
            image: true,
          }));
        } else {
          setErrorFields((prev) => ({
            ...prev,
            image: false,
          }));
        }
        break;

      case "ratings":
        if (fields.ratings === "") {
          setErrorFields((prev) => ({
            ...prev,
            ratings: true,
          }));
        } else {
          setErrorFields((prev) => ({
            ...prev,
            ratings: false,
          }));
        }
        break;

      case "length":
        if (fields.length === "" || !/^[1-9][0-9]*$/.test(fields.length)) {
          setErrorFields((prev) => ({
            ...prev,
            length: true,
          }));
        } else {
          setErrorFields((prev) => ({
            ...prev,
            length: false,
          }));
        }
        break;

      case "genres":
        if (fields.genres.length === 0) {
          setErrorFields((prev) => ({
            ...prev,
            genres: true,
          }));
        } else {
          setErrorFields((prev) => ({
            ...prev,
            genres: false,
          }));
        }
        break;

      default:
        break;
    }
  };

  // Function to edit movie details
  //-------------------------------------------
  const editMovie = async () => {
    const formData = new FormData();
    formData.append("title", fields.title);
    formData.append("ratings", fields.ratings);
    formData.append("length", fields.length);
    formData.append("image", fields.image);
    formData.append("genres", JSON.stringify(fields.genres));
    try {
      const response = await axios.put(`${API_MOVIES}/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMovies(response.data);
      toast.success("Successfuly updated");
      setTimeout(() => {
        navigate("/movies");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // Function to handle form submission
  //-------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValidationOnSubmit()) {
      editMovie();
    }
  };

  // Function to handle canceling the edit
  //-------------------------------------------
  const handleCancelEdit = () => {
    navigate("/movies");
  };

  return (
    <div className="movie-edit">
      <h1>Edit Movie</h1>
      <form onSubmit={handleSubmit}>
        <div className="upload-image ">
          <input
            type="file"
            name="image"
            className="image"
            onChange={handleFileChange}
            onBlur={() => handleFieldValidation("image")}
            accept="image/*"
          />
          <button>
            <div className="upload-image-icon">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="preview-image"
                />
              ) : (
                <span>
                  {fields.image && <img src={fields.image.secureUrl} />}
                </span>
              )}
            </div>
          </button>
        </div>
        <div className="title form-group flex">
          <label className="title-label">Title</label>
          <input
            type="text"
            name="title"
            value={fields.title}
            onChange={handleInputChange}
            onBlur={() => handleFieldValidation("title")}
            placeholder="Enter title"
          />
          {errorFields.title && (
            <div className="error-message">
              {fields.title === ""
                ? "Please enter a title."
                : "Movie name must be at least 2 characters long."}
            </div>
          )}
        </div>
        <div className="rating-length form-group">
          <div className="ratings  flex">
            <label className="ratings-label">Ratings</label>
            <input
              type="range"
              name="ratings"
              value={fields.ratings}
              onChange={handleInputChange}
              onBlur={() => handleFieldValidation("ratings")}
              min="1"
              max="5"
            />
            <span>{fields.ratings}</span>
            {errorFields.ratings && (
              <div className="error-message">Please select a rating.</div>
            )}
          </div>
          <div className="length  flex">
            <label className="length-label">Length(minutes)</label>
            <input
              type="number"
              value={fields.length}
              name="length"
              onChange={handleInputChange}
              onBlur={() => handleFieldValidation("length")}
            />
            {errorFields.length && (
              <div className="error-message">
                Please enter the length of the movie.
              </div>
            )}
          </div>
        </div>
        <div className="genres flex">
          <label className="genre-label">Genres: </label>
          {errorFields.genres && (
            <div className="error-message">
              Please select at least one genre.
            </div>
          )}
          <div className="genres-collection">
            {genres.map((genre) => (
              <div className="genre" key={genre._id}>
                <input
                  type="checkbox"
                  id={genre.title}
                  onChange={handleGenreChange}
                  onBlur={() => handleFieldValidation("genres")}
                  name="genres"
                  value={genre._id}
                  checked={fields.genres.includes(genre._id)}
                />
                <label htmlFor={genre.title}>{genre.originalTitle}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="buttons-submit-and-cancel">
          <button className="cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Update
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};
