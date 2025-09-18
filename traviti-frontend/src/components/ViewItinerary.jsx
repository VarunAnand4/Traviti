import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJSON } from '../api';
import './ViewItinerary.css';


export default function ViewItinerary() {
  const { id } = useParams();
  const [it, setIt] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getJSON(`/itineraries/${id}`);
      if (!res.error) setIt(res);
    })();
  }, [id]);

  if (!it) return <div>Loading...</div>;

 return (
  <div className="view-itinerary-container">
    <h3>{it.title}</h3>
    <div><strong>From:</strong> {it.startLocation}</div>
    <div><strong>To:</strong> {it.endLocation}</div>
    <div>
      <strong>Stops (in order):</strong>
      <ol>
        {(it.stops || []).map((s, idx) => <li key={idx}>{s}</li>)}
      </ol>
    </div>
    <div><strong>Modes (per segment):</strong> {(it.modes || []).join(', ')}</div>
    <div><strong>Total distance:</strong> {it.totalDistance} km</div>
    <div><strong>Total duration:</strong> {it.totalDuration} minutes</div>
  </div>
);
}
