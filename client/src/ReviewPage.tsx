import { useState } from 'react';
import TopicNavbar from './TopicNavbar';
import ReviewList from './ReviewList';
//import CustomCardForm from './CustomCardForm';
import AddQuestionForm from './AddQuestionForm'; // 你新建的组件

function ReviewPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // 用于强制刷新 ReviewList
  const handleAddSuccess = () => {
    setRefreshKey((prev) => prev + 1); // 触发刷新
  };
  return (
    <div>
      <TopicNavbar onSelectTopic={setSelectedTopic} />
      {selectedTopic ? (
        <>
          {/* <CustomCardForm topic={selectedTopic} onAdd={handleAdd} /> */}
          <AddQuestionForm
            topic={selectedTopic}
            onAddSuccess={handleAddSuccess}
          />
          {/* 组件之间是“单向数据流”，它不知道 AddQuestionForm 提交了新数据。
           我们用一个叫 refreshKey（或 refreshTrigger）的状态变量来做“刷新信号”。*/}
          <ReviewList topic={selectedTopic} refreshKey={refreshKey} />
        </>
      ) : (
        <div className="p-4">Please select a topic to review.</div>
      )}
    </div>
  );
}

export default ReviewPage;
