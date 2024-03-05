import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MovieContext } from "../../context/MovieContext";
import { UserContext } from "../../context/UserContext";
import { useLogout } from "../../hooks/useLogout";
import "./SideBar.css";
//=========================================================

// Sidebar component
//--------------------------------------------------------------------------------
export const SideBar = () => {
  // Context to control the sidebar visibility and retrieve user information
  //------------------------------------------------------------------------------
  const { showSidebar, setShowSidebar } = useContext(MovieContext);
  const { currentUser } = useContext(UserContext);

  // Logout function using custom hook
  //-----------------------------------------------------------------
  const handleLogout = useLogout();

  // Extracting user information from the current user context
  //------------------------------------------------------------------------------
  const username = currentUser.username;
  const userRole = currentUser.role;

  // Extracting the current location using useLocation hook from react-router-dom
  //------------------------------------------------------------------------------
  const location = useLocation();

  // Array containing admin roles to determine menu options visibility
  //------------------------------------------------------------------------------
  const adminRoles = [
    "Super Admin",
    "Content Administrator",
    "User Administrator",
  ];

  return (
    <div className={`sidebar ${showSidebar ? "active-sidebar " : ""} `}>
      <div className="sidebar-header">
        <h2>{username}</h2>
      </div>
      <ul className="nav-list">
        {/* Dashboard navigation item */}
        <li
          className={`nav-item dashboard-nav ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          <Link to="/">
            <div onClick={() => setShowSidebar(false)}>
              <span className="dashboard-text">Dashboard</span>
            </div>
          </Link>
        </li>

        {/* Movies and Genres navigation items (visible for Super Admin and Content Administrator) */}
        {(userRole === "Super Admin" ||
          userRole === "Content Administrator") && (
          <>
            <li
              className={`nav-item movies-nav ${
                location.pathname === "/movies" ? "active" : ""
              }`}
            >
              <Link to="/movies">
                <div onClick={() => setShowSidebar(false)}>
                  <span className="movies-text"> Movies</span>
                </div>
              </Link>
            </li>

            <li
              className={`nav-item genres-nav ${
                location.pathname === "/genres" ? "active" : ""
              }`}
            >
              <Link to="/genres">
                <div onClick={() => setShowSidebar(false)}>
                  <span className="genres-text">Genres</span>
                </div>
              </Link>
            </li>
          </>
        )}

        {/* Users navigation item (visible for Super Admin and User Administrator) */}
        {(userRole === "Super Admin" || userRole === "User Administrator") && (
          <li
            className={`nav-item users-nav ${
              location.pathname === "/users" ? "active" : ""
            }`}
          >
            <Link to="/users">
              <div onClick={() => setShowSidebar(!showSidebar)}>
                <span className="users-text">Users</span>
              </div>
            </Link>
          </li>
        )}
      </ul>

      {/* Logout button */}
      <div className="logout" onClick={handleLogout}>
        <div>Logout</div>
      </div>
    </div>
  );
};
