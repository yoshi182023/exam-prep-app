import QuestionComponent from './QuestionComponent';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Link } from 'react-router-dom';
import Navbar from './Navbar';
import SignInPage from './SignInPage';
import { RegistrationForm } from './RegistrationForm';
import ReviewPage from './ReviewPage';
import WrongAnswersPage from './WrongAnswersPage';
export default function App() {
  return (
    <BrowserRouter>
      <Link className="link-button" to="/">
        Home
      </Link>
      <Link to="/sign-in">Sign In</Link>
      <Link to="/question/Economics/3"> QuestionComponent</Link>
      <Link to="/reviews">Review My Flashcards</Link>
      <Link to="/wrong-answers">Mistakes</Link>

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
        {/* ✅ 新增 */}
      </Routes>
      <Navbar />
    </BrowserRouter>
  );
}
