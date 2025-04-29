// QuestionComponent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Question = {
  questionNumber: number;
  question: string;
  a: string;
  b: string;
  c: string;
  answer: string;
  explanation: string;
  topic?: string; // 添加这个字段以匹配后端
};

export default function QuestionComponent() {
  const navigate = useNavigate();
  const { topicName, questionNumber } = useParams();
  console.log('topic:', topicName);
  console.log('questionNumber:', questionNumber);
  //const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topicName || !questionNumber) return;
      setLoading(true);

      try {
        const response = await fetch(
          `/api/questions/topic/${topicName}/${questionNumber}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }
        const data = await response.json();
        // 添加调试日志
        console.log('Received question data:', data);

        setCurrentQuestion(data); // Set the current question directly
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topicName, questionNumber]);

  useEffect(() => {
    if (questionNumber) {
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [questionNumber]);

  function handleAnswerClick(choice: string) {
    if (showExplanation) return;
    setSelectedAnswer(choice);
    setShowExplanation(true);
  }

  function handleSkip() {
    if (!topicName || !questionNumber) return;

    navigate(`/question/${topicName}/${parseInt(questionNumber!) + 1}`); // 保持编码一致性
  }

  function handleTopicChange(newTopic: string) {
    navigate(`/question/${encodeURIComponent(newTopic)}/1`);
  }

  if (loading || !currentQuestion) return <div>Loading...</div>;

  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1>Topic: {topicName}</h1>
        <h2>Question Number: {questionNumber}</h2>
        {/* Navbar - topic buttons */}
        <button
          onClick={() =>
            handleTopicChange('Ethical and Professional Standards')
          }>
          Ethical and Professional Standards
        </button>
        <button onClick={() => handleTopicChange('Quantitative Methods')}>
          Quantitative Methods
        </button>
        <button onClick={() => handleTopicChange('Economics')}>
          Economics
        </button>
        <button
          onClick={() => handleTopicChange('Financial Statement Analysis')}>
          Financial Statement Analysis
        </button>
        <button onClick={() => handleTopicChange('Corporate Finance')}>
          Corporate Finance
        </button>
        <button onClick={() => handleTopicChange('Equity Investments')}>
          Equity Investments
        </button>
        <button onClick={() => handleTopicChange('Derivative Investments')}>
          Derivative Investments
        </button>
        <button onClick={() => handleTopicChange('Fixed Income Investments')}>
          Fixed Income Investments
        </button>
        <button onClick={() => handleTopicChange('Alternative Investments')}>
          Alternative Investments
        </button>
        <button onClick={() => handleTopicChange('Portfolio Management')}>
          Portfolio Management
        </button>
      </div>

      <h3>{currentQuestion.question}</h3>

      <div>
        {['a', 'b', 'c'].map((key) => (
          <button
            key={key}
            disabled={showExplanation}
            onClick={() => handleAnswerClick(key)}
            style={{
              backgroundColor:
                showExplanation && key === currentQuestion.answer
                  ? 'lightgreen'
                  : showExplanation && key === selectedAnswer
                  ? 'lightcoral'
                  : 'white',
              margin: '5px',
              opacity: showExplanation ? 0.6 : 1, // 透明度
              color: showExplanation ? 'purple' : 'black',

              padding: '10px 20px',
            }}>
            {currentQuestion[key as 'a' | 'b' | 'c']}
          </button>
        ))}
      </div>

      <div className="actions" style={{ marginTop: '20px' }}>
        <div className="actions" style={{ marginTop: '20px' }}>
          <button onClick={handleSkip}>Add LOS to Review</button>
          <button onClick={handleSkip}>Skip</button>
        </div>
      </div>

      {showExplanation && (
        <div style={{ marginTop: '20px' }}>
          <h3>{isCorrect ? 'Correct!' : 'Incorrect!'}</h3>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}
