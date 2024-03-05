import { FaStar, FaRegStar } from "react-icons/fa";

export const StarRating = ({ rating }) => {
  const maxStars = 5;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i}>
        {i <= rating ? (
          <FaStar className="golden-star" />
        ) : (
          <FaRegStar className="empty-star" />
        )}
      </span>
    );
  }

  return <div className="star-rating-container">{stars}</div>;
};
