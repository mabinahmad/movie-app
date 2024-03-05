import React, { useContext } from "react";
import { MovieContext } from "../../context/MovieContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { UserContext } from "../../context/UserContext";
import "./Header.css";
//===========================================================

//Header section of the application
//------------------------------------------------
export const Header = () => {
  const { showSidebar, setShowSidebar } = useContext(MovieContext);
  const { token } = useContext(UserContext);

  return (
    <>
      <div className="header-container">
        <div className="header">
          {/* Render hamburger menu icon if user is authenticated and sidebar is hidden */}
          {token && (
            <>
              {showSidebar === false ? (
                <span
                  className="sidebar-toggle"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <GiHamburgerMenu className="hamburger-icon" />
                </span>
              ) : (
                /* Render close icon if sidebar is visible */
                <span
                  className="close"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <IoMdClose className="close-icon" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
