import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import type { Question } from './QuestionComponent';

// 前端 search API：调用你自己的后端
const searchAPI = async (keyword: string, limit = 100) => {
  const response = await fetch(
    `/api/questions/search?q=${encodeURIComponent(keyword)}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error('Search failed');
  }
  const data = await response.json();
  console.log(
    `/api/questions/search?q=${encodeURIComponent(keyword)}&limit=${limit}`
  );

  return data; // 返回题目数组
};

export default function SearchQuestions() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Question[]>([]);

  const debouncedSearch = useCallback(
    _.debounce(async (keyword: string, limit = 10) => {
      if (keyword.trim() === '') {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchAPI(keyword, limit);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 1500), // 调整 delay
    []
  );

  useEffect(() => {
    debouncedSearch(input);
  }, [input]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search Questions In QuestionBank</h2>
      <input
        className="questionBank"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search by keyword..."
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />

      {suggestions.length > 0 && (
        <ul style={{ marginTop: '1rem', listStyleType: 'none', padding: 0 }}>
          {suggestions.map((item) => (
            <li
              key={item.questionid}
              style={{
                borderBottom: '1px solid #ccc',
                marginBottom: '1rem',
                paddingBottom: '1rem',
              }}>
              <strong>Question:</strong> {item.question} <br />
              <strong>Topic:</strong> {item.topic} <br />
              <strong>LOS:</strong> {item.los} <br />
              <strong>Explanation:</strong> {item.explanation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
