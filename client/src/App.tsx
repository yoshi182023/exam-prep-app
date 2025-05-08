import QuestionComponent from './QuestionComponent';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Link } from 'react-router-dom';
import SignInPage from './SignInPage';
import { RegistrationForm } from './RegistrationForm';
import ReviewPage from './ReviewPage';
import WrongAnswersPage from './WrongAnswersPage';
import SearchQuestions from './SearchQuestions';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {' '}
        {/* 导航容器 */}
        <div className="nav-container">
          {/* Home 按钮 - 绝对最左边 */}
          <Link className="link-button home-button" to="/">
            Home
          </Link>

          {/* 右侧按钮组 */}
          <div className="right-links">
            <Link className="link" to="/sign-in">
              Sign In
            </Link>
          </div>
        </div>
        {/* 主内容区 */}
        <div className="main-content">
          <Routes>
            {/* 根路由 */}
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/question/:topicName/:questionNumber" // 统一使用 topicName
              element={<QuestionComponent />}
            />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/wrong-answers" element={<WrongAnswersPage />} />{' '}
            <Route
              path="/search"
              element={
                <div className="route-search">
                  <SearchQuestions />
                </div>
              }
            />
            {/* <Link className="link" to="/wrong-answers">
          Mistakes
        </Link> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
