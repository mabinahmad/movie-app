import React, { useContext } from "react";
import "./FrontPage.css";
import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
//==========================================================


export const FrontPage = () => {
  const { currentUser } = useContext(UserContext);
  return (
    <div className="front-page">
      <div className="contents">
        <h1>Limited Movies, TV shows, and more </h1>
        <p>Watch anytime, cancel anytime.</p>
        <p>
          {`  ${
            currentUser?._id
              ? "Ready to continue? Click Continue to pick up where you left off."
              : "Ready to start? Click Get Started to sign up and begin your journey."
          } `}
        </p>
        <Link to={currentUser?._id ? "/home" : "/signup"}>
          <button className="get-started-button">
            {currentUser?._id ? "Continue" : "Get Started"}
            <BsChevronRight className="right-arrow-icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};
