import React from "react";

type Review = {
  id: number;
  name: string;
  rating: number;
  reviewText: string;
  date: string;
};

type UserReviewsProps = {
  reviews: Review[];
};

const UserReviews: React.FC<UserReviewsProps> = ({ reviews }) => {
  return (
    <div className="max-w-4xl rounded-md bg-white px-6 py-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">User Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600">
          No reviews yet. Be the first to write one!
        </p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="mb-6 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                {review.name}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-1 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < review.rating ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`h-5 w-5 ${
                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.614 4.946a1 1 0 00.95.69h5.2c.969 0 1.371 1.24.588 1.81l-4.2 3.047a1 1 0 00-.364 1.118l1.615 4.947c.3.92-.755 1.688-1.539 1.118L12 16.347l-4.203 3.047c-.783.57-1.838-.197-1.539-1.118l1.615-4.947a1 1 0 00-.364-1.118L3.309 10.373c-.783-.57-.38-1.81.588-1.81h5.2a1 1 0 00.95-.69l1.614-4.946z"
                  />
                </svg>
              ))}
            </div>

            <p className="mt-2 text-gray-600">{review.reviewText}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserReviews;
