import React, { useState } from 'react';
import { useUser } from './UserContext';
import './AddQuestionForm.css';
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
    <form onSubmit={handleSubmit} className="question-form">
      <h2 className="form-header">Set your own new question for</h2>
      <span className="form-topic">"{topic}"</span>
      <input
        name="los"
        placeholder="LOS"
        onChange={handleChange}
        value={formData.los}
        className="form-input form-input-regular"
      />
      <textarea
        name="question"
        placeholder="Question"
        onChange={handleChange}
        value={formData.question}
        className="form-input form-input-large"
      />
      <input
        name="answer"
        placeholder="Correct Answer (optional)"
        onChange={handleChange}
        value={formData.answer}
        className="form-input form-input-regular"
      />
      <input
        name="a"
        placeholder="Option A"
        onChange={handleChange}
        value={formData.a}
        className="form-input form-input-regular"
      />
      <input
        name="b"
        placeholder="Option B"
        onChange={handleChange}
        value={formData.b}
        className="form-input form-input-regular"
      />
      <input
        name="c"
        placeholder="Option C"
        onChange={handleChange}
        value={formData.c}
        className="form-input form-input-regular"
      />
      <textarea
        name="explanation"
        placeholder="Explanation"
        onChange={handleChange}
        value={formData.explanation}
        className="form-input form-input-large"
      />
      <input
        name="questionNumber"
        placeholder="Question Number"
        onChange={handleChange}
        value={formData.questionNumber}
        className="form-input form-input-large"
      />
      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default AddQuestionForm;
