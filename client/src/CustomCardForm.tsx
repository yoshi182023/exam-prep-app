import React, { useState } from 'react';
import { useUser } from './UserContext';

type Props = {
  topic: string;
  onAdd: () => void; // 用来触发 refresh
};

const CustomCardForm: React.FC<Props> = ({ topic, onAdd }) => {
  const { user } = useUser();
  const [los, setLos] = useState('');
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/add-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ topic, los, question, explanation }),
    });

    if (res.ok) {
      setLos('');
      setQuestion('');
      setExplanation('');
      onAdd(); // 触发 refresh ReviewList
    } else {
      alert('Failed to add card');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-bold mb-2">Add Your Own Question</h3>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Learning Objective"
          value={los}
          onChange={(e) => setLos(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>
      <div className="mb-2">
        <textarea
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>
      <div className="mb-2">
        <textarea
          placeholder="Explanation (optional)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full border p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add to Review List
      </button>
    </form>
  );
};

export default CustomCardForm;
