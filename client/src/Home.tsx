import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div>
        <h1>Chartered Financial Analyst Exam Prep.</h1>
      </div>
      <div className="button-container">
        <Link to="/reviews" className="big-button left-button">
          <h2>Review My Flashcards</h2>
        </Link>
        <Link to="/question/Economics/1" className="big-button right-button">
          <h2 className="right"> Practice by Subjects</h2>
        </Link>
      </div>
    </>
  );
}
