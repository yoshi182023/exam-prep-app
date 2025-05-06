import { useUser } from './UserContext'; // 用于获取当前登录用户

import { useNavigate } from 'react-router-dom';

type Props = {
  questionid: number;
  topic: string;
};

export default function AddToReviewButton({ topic, questionid }: Props) {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      const shouldLogin = window.confirm(
        'You must be logged in to add this question to your review. Do you want to sign in now?'
      );
      if (shouldLogin) {
        navigate('/sign-in');
      }
      return;
    }

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // token 存在于 UserContext 中
        },
        body: JSON.stringify({ topic, questionid }),
      });
      console.log({ topic, questionid });
      if (response.ok) {
        alert('This question was added to your review list!');
      } else if (response.status === 409) {
        alert('This question is already in your review list.');
      } else {
        throw new Error('Unexpected error');
      }
    } catch (error) {
      console.error('Failed to add to review:', error);
      alert('Failed to add this question. Did you sign in?');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded">
      Add to Review
    </button>
  );
}
