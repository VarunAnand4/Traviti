import React, { useState, useEffect } from 'react';
import { postJSON } from '../api';
import { useNavigate } from 'react-router-dom';
import './CreateItinerary.css';
export default function CreateItinerary() {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [stops, setStops] = useState([]); // array of strings
  const [modes, setModes] = useState(['drive']); // segments = stops.length + 1
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ensure modes length = stops.length + 1
    const needed = stops.length + 1;
    setModes(prev => {
      const copy = [...prev];
      while (copy.length < needed) copy.push('drive');
      while (copy.length > needed) copy.pop();
      return copy;
    });
  }, [stops.length]);

  function addStop() {
    setStops(s => [...s, '']);
  }
  function setStopAt(i, v) {
    setStops(s => s.map((x, idx) => idx === i ? v : x));
  }
  function removeStop(i) {
    setStops(s => s.filter((_, idx) => idx !== i));
  }
  function setModeAt(i, v) {
    setModes(m => m.map((x, idx) => idx === i ? v : x));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('Creating...');
    const body = { title, start_location: start, end_location: end, stops, mode_of_travel: modes };
    const res = await postJSON('/itineraries', body);
    if (res.id) {
      setMsg('Created!');
      navigate(`/itineraries/${res.id}`);
    } else {
      setMsg(res.error || JSON.stringify(res));
    }
  }

  return (
  <div className="create-itinerary-container">
    <form onSubmit={submit}>
      <h3>Create Itinerary</h3>
      {msg && <div>{msg}</div>}

      <div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      </div>

      <div>
        <input value={start} onChange={e=>setStart(e.target.value)} placeholder="Start address" />
      </div>

      <div>
        <h4>Stops</h4>
        {stops.map((s, i) => (
          <div key={i} className="stop-row">
            <input value={s} onChange={e=>setStopAt(i, e.target.value)} placeholder={`Stop ${i+1}`} />
            <button type="button" onClick={() => removeStop(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addStop}>Add Stop</button>
      </div>

      <div>
        <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="End address" />
      </div>

      <div>
        <h4>Mode per segment</h4>
        {modes.map((m, i) => (
          <div key={i}>
            <select value={m} onChange={e => setModeAt(i, e.target.value)}>
              <option value="drive">Drive</option>
              <option value="walk">Walk</option>
              <option value="bike">Bike</option>
              <option value="train">Train</option>
            </select>
            <span style={{ marginLeft: 8 }}>Segment {i + 1}</span>
          </div>
        ))}
      </div>

      <button type="submit">Create</button>
    </form>
  </div>
);

}
