// QuestionComponent.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopicButtons from './TopicButtons';
import AddToReviewButton from './AddToReviewButton';
import { useUser } from './UserContext'; // 用于获取当前登录用户

export type Question = {
  questionNumber: number;
  question: string;
  a: string;
  b: string;
  c: string;
  answer: 'a' | 'b' | 'c';
  explanation: string;
  topic: string; // 添加这个字段以匹配后端
  questionid: number;
  los: string;
};

export default function QuestionComponent() {
  const { user } = useUser();
  console.log(user);
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
    if (showExplanation || !currentQuestion) return;
    const isCorrect = choice === currentQuestion?.answer;
    setSelectedAnswer(choice);
    setShowExplanation(true);
    // 发给后端
    sendAnswerToServerHelper(choice, isCorrect);
  }
  async function sendAnswerToServerHelper(choice: string, isCorrect: boolean) {
    const userid = user?.user?.userid;
    console.log('user:', user);
    console.log('currentQuestion:', currentQuestion);
    if (!userid || !currentQuestion) {
      console.warn('Missing user or question info');
      return;
    }
    try {
      console.log('Sending answer to server:', {
        userid,
        questionid: currentQuestion.questionid,
        selectedAnswer: choice,
        isCorrect,
      });

      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          questionid: currentQuestion.questionid,
          selectedAnswer: choice,
          isCorrect,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save answer. Status: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Answer saved successfully:', data);
    } catch (error) {
      console.error('❌ Error sending answer:', error);
    }
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
    <div className="question-container">
      <div className="question">Topic: {currentQuestion.topic}</div>
      <h3 style={{ textAlign: 'left' }}>{currentQuestion.question}</h3>

      <div className="option">
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
              opacity: showExplanation ? 0.6 : 1,
              color: showExplanation ? 'purple' : 'black',

              padding: '10px 20px',
            }}>
            {currentQuestion[key as 'a' | 'b' | 'c']}
          </button>
        ))}
      </div>
      <div className="action-buttons" style={{ marginTop: '10px' }}>
        <div className="actions" style={{ marginTop: '20px' }}>
          <AddToReviewButton
            questionid={currentQuestion.questionid}
            topic={currentQuestion.topic ?? ''}
          />
          <button className="skip-button" onClick={handleSkip}>
            Skip
          </button>
        </div>
      </div>

      {showExplanation && (
        <div style={{ marginTop: '20px' }}>
          <h3>{isCorrect ? 'Correct ✅' : '❌ Incorrect '}</h3>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}
      <TopicButtons onTopicChange={handleTopicChange} />
    </div>
  );
}
