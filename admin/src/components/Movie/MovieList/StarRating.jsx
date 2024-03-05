import { FaStar, FaRegStar } from "react-icons/fa";

export const StarRating = ({ rating }) => {
  const maxStars = 5;
  const stars = [];

  // Loop to generate stars based on the rating value
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i}>
        {i <= rating ? (
          // Render a filled star for ratings equal to or less than the provided rating
          <FaStar className="golden-star" />
        ) : (
          // Render an empty star for ratings greater than the provided rating
          <FaRegStar className="empty-star" />
        )}
      </span>
    );
  }

  // Render the star rating component
  return <div className="star-rating-container">{stars}</div>;
};
