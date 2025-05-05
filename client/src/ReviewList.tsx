import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
type ReviewItem = {
  topic: string;
  questionid: number;
  los: string;
  explanation: string;
  created_at: string;
};

type Props = {
  topic: string;
};

const ReviewList: React.FC<Props> = ({ topic }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // null = list view

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      // const token = localStorage.getItem('token');
      const token = user.token;
      const res = await fetch(`/api/reviews/${topic}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('Fetched data:', data);

      setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, [topic]);

  if (loading) return <div>Loading reviews...</div>;
  if (reviews.length === 0)
    return <div>No reviews found for topic: {topic}</div>;

  // === Card View ===
  if (currentIndex !== null) {
    const review = reviews[currentIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl">
          <h2 className="text-xl font-bold mb-2">Topic: {review.topic}</h2>
          <div className="mb-4">
            <strong>LOS:</strong> {review.los}
          </div>
          <div className="mb-4">
            <strong>Explanation:</strong> {review.explanation}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Saved on:
            {new Date(review.created_at as string).toLocaleDateString('en-US')}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
              Exit
            </button>
            <button
              onClick={() => {
                if (currentIndex < reviews.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setCurrentIndex(null); // if last, return to list
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              {currentIndex < reviews.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === List View ===
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Review List for "{topic}"</h2>
      <ul className="space-y-4">
        {reviews.map((item, idx) => (
          <li key={item.questionid} onClick={() => setCurrentIndex(idx)}>
            <div>
              <strong>LOS:</strong> {item.los}
            </div>
            <div className="text-sm text-gray-500">
              Saved on: {new Date(item.created_at).toLocaleDateString()}
            </div>
            <button> Delete </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
