import React from 'react';
import QuestionComponent from './QuestionComponent';

import { Routes, Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function Home() {
  return <h1>Welcome! Please select a question.</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 根路由 */}
        <Route path="/" element={<Home />} />
        {/* 修正的问题路由 - 添加前导斜线 */}
        <Route
          path="/question/:topicName/:questionNumber" // 统一使用 topicName
          element={<QuestionComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
}
