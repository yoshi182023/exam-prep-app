import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <NavLink
        className={({ isActive }) => (isActive ? 'active' : undefined)}
        to="/">
        home
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? 'active' : undefined)}
        to="dashboard">
        dashboard
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? 'active' : undefined)}
        to="login">
        login
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? 'active' : undefined)}
        to="profile">
        profile
      </NavLink>
    </div>
  );
};

export default Navbar;
