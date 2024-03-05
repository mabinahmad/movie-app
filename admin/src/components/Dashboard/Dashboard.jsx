import React, { useContext } from "react";
import { MovieContext } from "../../context/MovieContext";
import { UserContext } from "../../context/UserContext";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";
//============================================================
export const Dashboard = () => {
  // Access movie and user context
  //------------------------------------------------------
  const { movies, genres } = useContext(MovieContext);
  const { customers, adminUsers, currentUser } = useContext(UserContext);
  // Get current user's role
  //------------------------------------------------------
  const userRole = currentUser.role;

  // Calculate total counts
  //------------------------------------------------------
  const totalMovies = movies.length;
  const totalGenres = genres.length;
  const totalCustomers = customers.length;
  const totalEmployees = adminUsers.length;

  // Format date function
  //------------------------------------------------------
  const createdDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatedDate = new Date(date);
    return formatedDate.toLocaleDateString("en-US", options);
  };

  // Get genre titles based on genre IDs
  //------------------------------------------------------
  const getGenreTitles = (genreIds) => {
    return genreIds.map((genreId) => {
      const genre = genres.find((genre) => genre._id === genreId);
      return genre ? genre.originalTitle : "";
    });
  };

  // Render the dashboard UI
  //------------------------------------------------------
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Wlecome back to the Dashboard</p>

      {/* Render statistics based on user role */}
      <div className="statitics">
        {(userRole === "Super Admin" ||
          userRole === "Content Administrator") && (
          <>
            <div className="total-movies box">
              <span>Movies</span>
              <span>{totalMovies}</span>
            </div>
            <div className="total-genres box">
              <span>Genres</span>
              <span>{totalGenres}</span>
            </div>
          </>
        )}

        {(userRole === "Super Admin" || userRole === "User Administrator") && (
          <>
            <div className="total-users box">
              <span>Customers</span>
              <span>{totalCustomers}</span>
            </div>
            <div className="total-employees box">
              <span>Employees</span>
              <span>{totalEmployees}</span>
            </div>
          </>
        )}
      </div>

      {/* Render movies, users, and genres tables */}
      <div className="movies-genres-users">
        {(userRole === "Super Admin" ||
          userRole === "Content Administrator") && (
          <div className="movies-table-container">
            <h2>Movies</h2>
            <div className="movies-actions">
              <Link to="/movie-create">
                <button className="add-movie-button">
                  <FaPlusCircle className="add-icon" />
                  <span> Add</span>
                </button>
              </Link>
            </div>

            <div className="movies-table">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Movie Name</th>
                    <th>Genres</th>
                    <th>Ratings</th>
                  </tr>
                </thead>

                <tbody>
                  {movies.map((movie, index) => (
                    <tr key={movie._id}>
                      <td>{index + 1}</td>
                      <td>{movie.originalTitle}</td>
                      <td>{getGenreTitles(movie.genres).join(",")}</td>
                      <td>{movie.ratings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(userRole === "Super Admin" || userRole === "User Administrator") && (
          <>
            {/* Render admin's table */}
            <div className="users-table-container">
              <h2>Employees</h2>
              <div className="users-actions">
                <Link to="/user-create">
                  <button className="add-user-button">
                    <FaPlusCircle className="add-icon" />
                    <span> Add</span>
                  </button>
                </Link>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{user.email}</td>
                        <td>{createdDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Render customers table */}
            <div className="customers users-table-container">
              <h2>Customers</h2>

              <div className=" users-table">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{createdDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {(userRole === "Super Admin" ||
          userRole === "Content Administrator") && (
          <div className="genres-table-container">
            <h2>Genres</h2>
            <div className="genres-actions">
              <Link to="/genre-create">
                <button className="add-genre-button">
                  <FaPlusCircle className="add-icon" />
                  <span> Add</span>
                </button>
              </Link>
            </div>
            <div className="genres-table">
              <ul>
                {genres.map((genre, index) => (
                  <li key={genre._id}>
                    <span className="genre-number">{index + 1}</span>
                    <span>{genre.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
