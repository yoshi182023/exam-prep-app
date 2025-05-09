import React, { useState } from 'react';
import { useUser } from './UserContext';

type Props = {
  topic: string;
  onAddSuccess?: () => void; // 新增这个 prop
};

const AddQuestionForm: React.FC<Props> = ({ topic, onAddSuccess }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    los: '',
    question: '',
    answer: '',
    explanation: '',
    a: '',
    b: '',
    c: '',
    questionNumber: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      topic,
      userid: user?.user.userid,
    };

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('Added question:', data);
    // 可选：重置表单或通知 ReviewList 刷新
    if (res.ok) {
      setFormData({
        los: '',
        question: '',
        answer: '',
        explanation: '',
        a: '',
        b: '',
        c: '',
        questionNumber: '',
      });
      onAddSuccess?.(); // 触发刷新
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded mb-4">
      <h2 className="text-lg font-bold mb-2">Set your own new question for</h2>
      <p>"{topic}"</p>
      <input
        name="los"
        placeholder="LOS"
        onChange={handleChange}
        value={formData.los}
        className="input"
      />
      <textarea
        name="question"
        placeholder="Question"
        onChange={handleChange}
        value={formData.question}
        className="input"
      />
      <input
        name="answer"
        placeholder="Correct Answer"
        onChange={handleChange}
        value={formData.answer}
        className="input"
      />
      <input
        name="a"
        placeholder="Option A"
        onChange={handleChange}
        value={formData.a}
        className="input"
      />
      <input
        name="b"
        placeholder="Option B"
        onChange={handleChange}
        value={formData.b}
        className="input"
      />
      <input
        name="c"
        placeholder="Option C"
        onChange={handleChange}
        value={formData.c}
        className="input"
      />
      <textarea
        name="explanation"
        placeholder="Explanation"
        onChange={handleChange}
        value={formData.explanation}
        className="input"
      />
      <input
        name="questionNumber"
        placeholder="Question Number"
        onChange={handleChange}
        value={formData.questionNumber}
        className="input"
      />
      <button
        type="submit"
        className="btn mt-2 bg-blue-600 text-white rounded px-4 py-2">
        Submit
      </button>
    </form>
  );
};

export default AddQuestionForm;
