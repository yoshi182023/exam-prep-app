import React from 'react';
import './TopicButtons.css';

const topics = [
  'Ethical and Professional Standards',
  'Quantitative Methods',
  'Economics',
  'Financial Statement Analysis',
  'Corporate Finance',
  'Equity Investments',
  'Derivative Investments',
  'Fixed Income Investments',
  'Alternative Investments',
  'Portfolio Management',
];
type Props = {
  onSelectTopic: (topic: string) => void;
};

const TopicNavbar: React.FC<Props> = ({ onSelectTopic }) => {
  return (
    <div className="topic-selector">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelectTopic(topic)}
          className="topic-btn">
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicNavbar;
