// src/components/TopicButtons.tsx
import './TopicButtons.css';

type TopicButtonsProps = {
  onTopicChange: (topic: string) => void;
};
const TOPICS = [
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

export default function TopicButtons({ onTopicChange }: TopicButtonsProps) {
  return (
    <div className="topic-selector">
      {TOPICS.map((topic) => (
        <button
          className="topic-btn"
          key={topic}
          onClick={() => onTopicChange(topic)}>
          {topic}
        </button>
      ))}
    </div>
  );
}
