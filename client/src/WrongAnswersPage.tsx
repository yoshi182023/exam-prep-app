import { useEffect, useState } from 'react';
import { useUser } from './UserContext'; // 用于获取当前登录用户

export default function WrongAnswersPage() {
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    const userid = localStorage.getItem('userid');
    console.log(userid);
    const token = user?.token; // 确保你有 access 到 user
    console.log('token', token);
    console.log(loading);
    const fetchWrongAnswers = async () => {
      setLoading(true);
      if (!user || !user.token) {
        console.error('User not authenticated');
        return;
      }

      try {
        const response = await fetch('/api/wrong-answers', {
          headers: {
            Authorization: `Bearer ${user.token}`, // ✅ 使用 token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        // 用一个对象来去重
        const seen = new Set();
        const uniqueAnswers = data.filter((item) => {
          if (seen.has(item.questionid)) {
            return false;
          }
          seen.add(item.questionid);
          return true;
        });
        setWrongAnswers(uniqueAnswers);
      } catch (error) {
        console.error('Error fetching wrong answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWrongAnswers();
  }, [user]);
  const getAnswerText = (item, choice) => {
    return item[choice]; // choice is 'a', 'b', or 'c'
  };

  return (
    <section class="goals-section">
      <h1>My Wrong Answers</h1>
      {wrongAnswers.length === 0 ? (
        <p>No wrong answers found.</p>
      ) : (
        <ul>
          {' '}
          {wrongAnswers.map((item) => (
            <div id="goals-container">
              <li className="card" key={item.questionid}>
                <strong>Topic:</strong> {item.topic} <br />
                <strong>Learning outcomes statements (LOS):</strong> {item.los}{' '}
                <br />
                <p>
                  <strong>Question:</strong> {item.question}
                </p>
                <strong>Correct Answer:</strong>{' '}
                {getAnswerText(item, item.answer)}
                <br />
                <strong>Selected Option:</strong>{' '}
                {getAnswerText(item, item.selectedAnswer)} <br />
                <strong>Answered At:</strong>{' '}
                {new Date(item.answeredAt).toLocaleString()} <br />
              </li>{' '}
            </div>
          ))}{' '}
        </ul>
      )}{' '}
    </section>
  );
}
