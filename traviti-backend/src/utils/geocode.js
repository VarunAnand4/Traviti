const axios = require('axios');
const USER_AGENT = process.env.USER_AGENT || 'TravitiAssignment/1.0 (example@example.com)';

async function geocode(address) {
  const url = 'https://nominatim.openstreetmap.org/search';
  const resp = await axios.get(url, {
    params: { q: address, format: 'json', limit: 1 },
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!resp.data || resp.data.length === 0) {
    throw new Error(`Geocode failed for address: ${address}`);
  }
  const { lat, lon } = resp.data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

module.exports = geocode;
