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
    </>
  );
}

export default Navbar;
