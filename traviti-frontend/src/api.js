const API_BASE = 'http://localhost:4000';

export function authHeader() {
  const token = localStorage.getItem('traviti_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function postJSON(path, body) {
  const resp = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body)
  });
  return resp.json();
}

export async function getJSON(path) {
  const resp = await fetch(API_BASE + path, {
    headers: { ...authHeader() }
  });
  return resp.json();
}
