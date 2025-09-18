import React, { useEffect, useState } from 'react';
import { getJSON } from '../api';
import { Link } from 'react-router-dom';
import './Card.css';

export default function MyItineraries() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getJSON('/itineraries');
      setList(Array.isArray(res) ? res : []);
    })();
  }, []);

  return (
    <div className="container">
      <h3 style={{ color: 'white'}}>My Itineraries</h3>
      {list.length === 0 ? (
        <div>No itineraries yet</div>
      ) : (
        <ul className="itinerary-list">
          {list.map(it => (
            <li key={it.id}>
              <div className="itinerary-card">
                <Link to={`/itineraries/${it.id}`}>{it.title}</Link>
                <div className="itinerary-meta">
                  {it.totalDistance} km • {it.totalDuration} min
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
