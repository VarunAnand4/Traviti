import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Register from './components/Register';
import Login from './components/Login';
import CreateItinerary from './components/CreateItinerary';
import MyItineraries from './components/MyItineraries';
import ViewItinerary from './components/ViewItinerary';
import './styles/global.css'

function RequireAuth({ children }) {
  const token = localStorage.getItem('traviti_token');
  return token ? children : <Navigate to="/login" />;
}

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="heading">Welcome to Traviti</h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '1rem', color: '#d7fc08ff', fontWeight: 'bolder', fontStyle: 'oblique'}}>
        Plan your perfect journey with ease and comfort.
      </p>
      <button className="discover-btn" onClick={() => navigate('/login')}>
        Discover Now
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/create"
          element={<RequireAuth><CreateItinerary /></RequireAuth>}
        />
        <Route
          path="/itineraries"
          element={<RequireAuth><MyItineraries /></RequireAuth>}
        />
        <Route
          path="/itineraries/:id"
          element={<RequireAuth><ViewItinerary /></RequireAuth>}
        />
      </Routes>
    </div>
  );
}
