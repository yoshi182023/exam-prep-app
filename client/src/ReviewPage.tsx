import { useState } from 'react';
import TopicNavbar from './TopicNavbar';
import ReviewList from './ReviewList';
//import CustomCardForm from './CustomCardForm';
import AddQuestionForm from './AddQuestionForm'; // 你新建的组件

function ReviewPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  //const [refreshKey, setRefreshKey] = useState(0); // 用于强制刷新 ReviewList
  // const handleAdd = () => {
  //   setRefreshKey((prev) => prev + 1); // 强制 re-render ReviewList
  // };
  return (
    <div>
      <TopicNavbar onSelectTopic={setSelectedTopic} />
      {selectedTopic ? (
        <>
          {/* <CustomCardForm topic={selectedTopic} onAdd={handleAdd} /> */}
          <AddQuestionForm topic={selectedTopic} />

          <ReviewList topic={selectedTopic} />
        </>
      ) : (
        <div className="p-4">Please select a topic to review.</div>
      )}
    </div>
  );
}

export default ReviewPage;
