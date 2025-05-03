import React from 'react';
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
    <div className="flex space-x-4 p-4 border-b">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelectTopic(topic)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicNavbar;
