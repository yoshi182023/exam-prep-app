import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';

type ReviewItem = {
  topic: string;
  questionid: number;
  los: string;
  explanation: string;
  created_at: string;
  source: 'review' | 'custom';
  reviewId: number;
};

type Props = {
  topic: string;
  refreshKey: number; // ✅
};

const ReviewList: React.FC<Props> = ({ topic, refreshKey }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // null = list view

  useEffect(() => {
    const fetchAllQuestions = async () => {
      setLoading(true);
      const token = user?.token;
      const [res1, res2] = await Promise.all([
        fetch(`/api/reviews/${topic}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/custom-questions/${topic}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [official, custom] = await Promise.all([res1.json(), res2.json()]);

      const all = [
        ...official.map((item: ReviewItem) => ({ ...item, source: 'review' })),
        ...custom.map((item: ReviewItem) => ({ ...item, source: 'custom' })),
      ];
      setReviews(all);
      setLoading(false);
    };
    fetchAllQuestions();
  }, [topic, refreshKey, user?.token]);

  const handleDelete = async (item: ReviewItem) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const token = user?.token;
    const endpoint =
      item.source === 'review'
        ? `/api/reviews/${item.reviewId}` // 👈 用 reviewId 来删
        : `/api/questions/${item.questionid}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setReviews(reviews.filter((r) => r.questionid !== item.questionid));
    } else {
      alert('Failed to delete question.');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (reviews.length === 0)
    return <div>No reviews found for topic: {topic}</div>;

  console.log('review items:', reviews);

  // === Card View ===
  if (currentIndex !== null) {
    const review = reviews[currentIndex];
    return (
      <div>
        <div>
          <h2>Topic: {review.topic}</h2>
          <div>
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
            <div className="review-card">
              <div>
                <strong>LOS:</strong> {item.los}
              </div>
              <div className="text-sm text-gray-500">
                Saved on: {new Date(item.created_at).toLocaleDateString()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 👈 避免触发外层 onClick（进入卡片视图）
                  handleDelete(item);
                }}
                className="delete"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
