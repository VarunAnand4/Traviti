import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJSON } from '../api';
import './Form.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await postJSON('/auth/register', { name, email, password });
    if (res.token) {
      localStorage.setItem('traviti_token', res.token);
      navigate('/create');
    } else {
      setErr(res.error || 'Registration failed');
    }
  }

  return (
    <div className="container">
      <div className="card form-card">
        <h3>Register</h3>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit}>
          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

