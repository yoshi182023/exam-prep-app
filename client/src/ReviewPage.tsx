import { useState } from 'react';
import TopicNavbar from './TopicNavbar';
import ReviewList from './ReviewList';

function ReviewPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <div>
      <TopicNavbar onSelectTopic={setSelectedTopic} />
      {selectedTopic ? (
        <ReviewList topic={selectedTopic} />
      ) : (
        <div className="p-4">Please select a topic to review.</div>
      )}
    </div>
  );
}

export default ReviewPage;
