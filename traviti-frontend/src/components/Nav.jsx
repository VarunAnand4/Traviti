import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('traviti_token');

  function logout() {
    localStorage.removeItem('traviti_token');
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="container nav-links">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/create">Create Itinerary</Link>
            <Link to="/itineraries">My Itineraries</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
