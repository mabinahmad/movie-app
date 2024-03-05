import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { MdCollectionsBookmark } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import { PiFilmReelFill } from "react-icons/pi";
import { useCombineContext } from "../../hooks/useCombineContext";
import { Link } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { MovieContext } from "../../context/MovieContext";
import { MdClose } from "react-icons/md";
//================================================================================

export const Header = () => {
  // State and context hooks
  //------------------------------------------------------------------------
  const [firstLetterOfUser, setFirstLetterOfUser] = useState("");
  const { userContext, themeContext } = useCombineContext();
  const { isLightMode, handleToggle } = themeContext;
  const { currentUser, token, handleLogout } = userContext;
  const { isFilter, setIsFilter, searchInputValue } = useContext(MovieContext);

  // State to manage the visibility of the tooltips
  const [showUserNameToolTip, setShowUserNameToolTip] = useState(false);
  const [showWatchLaterToolTip, setShowWatchLaterToolTip] = useState(false);

  const location = useLocation();

  //Current location
  //------------------------------------------------------------------------
  const isHomePage = location.pathname === "/home";
  const isFrontPage = location.pathname === "/";

  //Viewport
  //------------------------------------------------------------------------
  const isMobileView = useMediaQuery({ maxWidth: 414 });
  const isTabletView = useMediaQuery({ maxWidth: 1200 });

  // Update user's first letter when currentUser changes
  //-----------------------------------------------------------------------
  useEffect(() => {
    if (currentUser && currentUser.username) {
      setFirstLetterOfUser(currentUser.username.charAt(0).toUpperCase());
    } else {
      setFirstLetterOfUser("");
    }
  }, [currentUser]);

  // Function to handle opening the filter
  //-----------------------------------------------------------------------
  const handleHamburgerMenu = () => {
    setIsFilter(true);
  };

  // Function to handle closing the filter
  //-----------------------------------------------------------------------
  const handleFilterClose = () => {
    setIsFilter(false);
  };

  // Function to show tooltip for user name
  //-----------------------------------------------------------------------
  const handleShowUserNameToolTip = () => {
    setShowUserNameToolTip(true);
  };

  // Function to hide tooltip for user name
  //-----------------------------------------------------------------------
  const handleHideUserNameToolTip = () => {
    setShowUserNameToolTip(false);
  };

  // Function to show tooltip for "Watch Later" button
  //-----------------------------------------------------------------------
  const handleShowWatchLaterToolTip = () => {
    setShowWatchLaterToolTip(true);
  };

  // Function to hide tooltip for "Watch Later" button
  //-----------------------------------------------------------------------
  const handleHideWatchLaterToolTip = () => {
    setShowWatchLaterToolTip(false);
  };

  //Render component
  //-----------------------------------------------------------------------
  return (
    <div className={`header ${isLightMode ? "light-mode" : ""}`}>
      {!searchInputValue &&
        token &&
        ((isMobileView || isTabletView) && isHomePage && !isFilter ? (
          <div className={`hamburger-menu-container `}>
            <FiMenu onClick={handleHamburgerMenu} className="hamburger-menu" />
          </div>
        ) : (
          (isMobileView || isTabletView) &&
          isHomePage &&
          !isFrontPage && (
            <div>
              <MdClose
                onClick={handleFilterClose}
                className="close-filter-icon"
              />
            </div>
          )
        ))}

      <div className="logo-and-search">
        <div
          className={`logo-and-brandname ${
            isFrontPage ? "in-front-page" : ""
          } ${!token && "no-user"} `}
        >
          <PiFilmReelFill className="film-icon" />
          <Link to="/">
            <h1 className="brand-name">NetFilm</h1>
          </Link>
        </div>

        {isHomePage && <SearchBar />}
      </div>
      {/* Buttons and user authentication */}
      <div
        className={`buttons ${!token && "auth-false auth-alse-tablet"} ${
          isFrontPage ? " in-front-page-margin" : ""
        }`}
      >
        {/* Home and Watch Later buttons */}
        {currentUser?._id && (
          <>
            {isMobileView || isTabletView ? (
              <>
                <Link to="/home">
                  <FaHome className="navigate-to-home-button" />
                </Link>
                <Link to="/watchlater">
                  <MdCollectionsBookmark
                    className="saved-movies"
                    onMouseOver={handleShowWatchLaterToolTip}
                    onMouseOut={handleHideWatchLaterToolTip}
                  />
                </Link>

                {showWatchLaterToolTip && (
                  <span className="tooltip-watchlater-movies">
                    {`${currentUser.watchlater} saved movies  `}
                  </span>
                )}
              </>
            ) : (
              <>
                <Link to="/home">
                  <button className="navigate-to-home-button">Home</button>
                </Link>
                <Link to="/watchlater">
                  <button className="saved-movies">Watch Later</button>
                </Link>
              </>
            )}
          </>
        )}
        {/* Dark mode toggle */}
        <div>
          {isLightMode ? (
            <FiMoon className="moon-icon" onClick={handleToggle} />
          ) : (
            <FiSun className="sun-icon" onClick={handleToggle} />
          )}
        </div>
        {/* User authentication */}
        <div className="user-auth-container">
          <button className="auth-button">
            {currentUser?._id && token ? (
              <span onClick={handleLogout} className="logout-text">
                Logout
              </span>
            ) : (
              <Link to="/login">
                <span className="login-text">Login</span>
              </Link>
            )}

            {currentUser?._id && token && (
              <span
                className="user-name "
                onMouseOver={handleShowUserNameToolTip}
                onMouseOut={handleHideUserNameToolTip}
              >
                {firstLetterOfUser}
              </span>
            )}
          </button>
        </div>
        {/* Tooltip for user name */}
        {showUserNameToolTip && (
          <div className="tooltip-username">
            {currentUser.username.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};
