import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="search">Search Questions</NavLink>
    </div>
  );
}

export default Navbar;
