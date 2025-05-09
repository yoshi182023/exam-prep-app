import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className="navbar top">
        <NavLink to="search">Search Questions</NavLink>
      </div>{' '}
      <div className="navbar bottom">
        <NavLink to="wrong-answers">My Mistakes Journal</NavLink>
      </div>
      <footer className="footer">
        <div className="copyright">
          <h3>Customer Support</h3>
          <p>If you have questions or experience a problem, please </p>
          <span>Contact Us: </span>
          <p>Email: galiana1818@gmail.com </p>
          <p>
            &copy; {new Date().getFullYear()} CFA Exam Prep. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Navbar;
