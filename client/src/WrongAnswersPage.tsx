import { useEffect, useState } from 'react';
import { useUser } from './UserContext';

import type { Question } from './QuestionComponent';

export default function WrongAnswersPage() {
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [filteredAnswers, setFilteredAnswers] = useState<Question[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchWrongAnswers = async () => {
      setLoading(true);
      if (!user || !user.token) {
        console.error('User not authenticated');
        return;
      }

      try {
        const response = await fetch('/api/wrong-answers', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const seen = new Set();
        const uniqueAnswers = data.filter((item) => {
          if (seen.has(item.questionid)) return false;
          seen.add(item.questionid);
          return true;
        });

        setWrongAnswers(uniqueAnswers);

        // 提取 topic 列表
        const topicSet = new Set(uniqueAnswers.map((q) => q.topic));
        setTopics(['all', ...Array.from(topicSet)]);
        setFilteredAnswers(uniqueAnswers); // 初始显示全部
      } catch (error) {
        console.error('Error fetching wrong answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWrongAnswers();
  }, [user]);

  useEffect(() => {
    if (selectedTopic === 'all') {
      setFilteredAnswers(wrongAnswers);
    } else {
      setFilteredAnswers(
        wrongAnswers.filter((item) => item.topic === selectedTopic)
      );
    }
  }, [selectedTopic, wrongAnswers]);

  const getAnswerText = (item: any, choice: 'a' | 'b' | 'c') => item[choice];

  return (
    <section className="goals-section">
      <h2>My Mistakes Journal</h2>

      {/* 选择 Topic 的下拉框 */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="topic-select">
          <strong>Filter By Topic:</strong>{' '}
        </label>
        <select
          id="topic-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic === 'all' ? 'All Topics' : topic}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredAnswers.length === 0 ? (
        <p>No wrong answers found.</p>
      ) : (
        <ul>
          {filteredAnswers.map((item) => (
            <div id="goals-container" key={item.questionid}>
              <li className="card">
                <strong>Topic:</strong> {item.topic} <br />
                <strong>LOS:</strong> {item.los} <br />
                <p>
                  <strong>Question:</strong> {item.question}
                </p>
                <strong>Correct Answer:</strong>{' '}
                {getAnswerText(item, item.answer)} <br />
                <strong>Selected Option:</strong>{' '}
                {getAnswerText(item, item.selectedAnswer)} <br />
                <strong>Answered At:</strong>{' '}
                {new Date(item.answeredAt).toLocaleString()} <br />
              </li>
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
