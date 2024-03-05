import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { MovieContext } from "../../../context/MovieContext";
import { ToastContainer, toast } from "react-toastify";
import { LuUpload } from "react-icons/lu";
import "react-toastify/dist/ReactToastify.css";
import "./CreateMovie.css";
//=============================================================

// API endpoint for creating movies
//==================================================
const API_MOVIES = import.meta.env.VITE_API_MOVIES;
//==================================================

const CreateMovie = () => {
  // Context variables
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

  // Function to handle input change
  //----------------------------------------------------
  const handleInputChange = (event) => {
    setFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Function to handle genre selection
  //----------------------------------------------------
  const handleGenreChange = (event) => {
    let clonedGenres = [...fields.genres];
    if (event.target.checked) {
      clonedGenres.push(event.target.value);
    } else {
      clonedGenres = clonedGenres.filter(
        (genre) => genre !== event.target.value
      );
    }
    setFields((prev) => ({
      ...prev,
      genres: clonedGenres,
    }));
    setErrorFields((prev) => ({
      ...prev,
      genres: clonedGenres.length === 0,
    }));
  };

  // Function to handle file change for image upload
  //----------------------------------------------------
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

  // Function to create movie
  //----------------------------------------------------
  const createMovie = async (fields) => {
    const formData = new FormData();
    formData.append("title", fields.title);
    formData.append("ratings", fields.ratings);
    formData.append("length", fields.length);
    formData.append("image", fields.image);
    formData.append("genres", JSON.stringify(fields.genres));

    try {
      const response = await axios.post(API_MOVIES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Update movies state with the newly created movie
      setMovies(response.data);
      toast.success("Successfuly created");

      // Clear form fields after successful submission
      clearInput();
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // Function to clear form fields
  //----------------------------------------------------
  const clearInput = () => {
    setFields({
      title: "",
      ratings: 0,
      length: "",
      image: null,
      genres: [],
    });
  };

  // Function to handle form submission
  //----------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formValidationOnSubmit()) {
      createMovie(fields);
      clearInput();
    }
  };

  return (
    <div className="movie-create">
      <h1>Create Movie</h1>
      <form onSubmit={handleSubmit}>
        {errorFields.image && (
          <div className="error-message">Please select an image file.</div>
        )}
        <div className="upload-image">
          {/* <img className="image-preview" src={imagePreview && imagePreview} alt="" /> */}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            onBlur={() => handleFieldValidation("image")}
            accept="image/*"
            className="image"
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
                  {/* {fields.image ? fields.image.name : "No file selected"} */}
                  <LuUpload className="image-uplaod-icon" />
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
            className={errorFields.title ? "danger" : ""}
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
              className={errorFields.ratings ? "danger" : ""}
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
              name="length"
              value={fields.length}
              onChange={handleInputChange}
              onBlur={() => handleFieldValidation("length")}
              className={errorFields.length ? "danger" : ""}
            />
            {errorFields.length && (
              <div className="error-message">
                Please enter the length of the movie.
              </div>
            )}
          </div>
        </div>

        <div className="genres flex">
          <label>Genres: </label>
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
                  name="genres"
                  onChange={handleGenreChange}
                  onBlur={() => handleFieldValidation("genres")}
                  value={genre._id}
                  checked={fields.genres.includes(genre._id)}
                />
                <label htmlFor={genre.title}>{genre.originalTitle}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="button-submit">
          <button type="submit">Create</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateMovie;
