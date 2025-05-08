import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Home() {
  return (
    <>
      <div className="homepage">
        <h1>Chartered Financial Analyst Exam Prep</h1>
        <h2>CFA® Level 1</h2>
      </div>
      <div className="button-container">
        <Link to="/reviews" className="big-button left-button">
          <h2>Review My Flashcards</h2>
        </Link>
        <Link to="/question/Economics/1" className="big-button right-button">
          <h2 className="right"> Practice by Subjects</h2>
        </Link>
      </div>
      <div className="navbar-container">
        <Navbar />{' '}
      </div>
    </>
  );
}
