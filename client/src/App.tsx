import React from 'react';
import QuestionComponent from './QuestionComponent';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Link } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Link className="link-button" to="/">
        Home
      </Link>

      <Link to="/question/Economics/3"> QuestionComponent</Link>
      <Routes>
        {/* 根路由 */}
        <Route path="/" element={<Home />} />

        <Route
          path="/question/:topicName/:questionNumber" // 统一使用 topicName
          element={<QuestionComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
}
