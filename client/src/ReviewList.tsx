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
      // if (!Array.isArray(data)) {
      //   console.error('Expected array, got:', data);
      //   return [];
      // }
      //return data;

      setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, [topic]);

  if (loading) return <div>Loading reviews...</div>;
  if (reviews.length === 0)
    return <div>No reviews found for topic: {topic}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Review List for "{topic}"</h2>
      <ul className="space-y-4">
        {reviews.map((item) => (
          <li key={item.questionid} className="border p-4 rounded shadow">
            <div>
              <strong>LOS:</strong> {item.los}
            </div>
            <div>
              <strong>Explanation:</strong> {item.explanation}
            </div>
            <div className="text-sm text-gray-500">
              Added: {new Date(item.created_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
