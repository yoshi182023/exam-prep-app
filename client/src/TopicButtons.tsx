// src/components/TopicButtons.tsx

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
    <div style={{ marginBottom: '20px' }}>
      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => onTopicChange(topic)}
          style={{ margin: '5px', padding: '8px 15px' }}>
          {topic}
        </button>
      ))}
    </div>
  );
}
