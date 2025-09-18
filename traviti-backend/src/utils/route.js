const axios = require('axios');
const OSRM_BASE = process.env.OSRM_BASE_URL || 'http://router.project-osrm.org';

async function routeSegment(start, end, profile = 'driving') {
  // start/end: {lat, lon}
  const coords = `${start.lon},${start.lat};${end.lon},${end.lat}`;
  const url = `${OSRM_BASE}/route/v1/${profile}/${coords}`;
  const resp = await axios.get(url, { params: { overview: 'false' } });
  if (!resp.data || resp.data.code !== 'Ok') {
    throw new Error('OSRM routing error');
  }
  const r = resp.data.routes[0];
  return { distance: r.distance, duration: r.duration };
}

module.exports = routeSegment;

