const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const geocode = require('../utils/geocode');
const routeSegment = require('../utils/route');

// map simple mode names to OSRM profiles
const modeMap = {
  drive: 'driving',
  driving: 'driving',
  walk: 'walking',
  walking: 'walking',
  bike: 'cycling',
  bicycle: 'cycling',
  train: 'driving' // fallback (OSRM doesn't support train)
};

exports.createItinerary = async (req, res) => {
  try {
    const { title, start_location, end_location, stops, mode_of_travel } = req.body;
    if (!title || !start_location || !end_location || !Array.isArray(stops) || !Array.isArray(mode_of_travel)) {
      return res.status(400).json({ error: 'Missing or invalid fields. stops and mode_of_travel must be arrays.' });
    }

    // segments = stops.length + 1
    const expectedSegments = (stops || []).length + 1;
    if (mode_of_travel.length !== expectedSegments) {
      return res.status(400).json({ error: `mode_of_travel should have ${expectedSegments} items (one per segment)` });
    }

    const addresses = [start_location, ...stops, end_location];
    const coords = [];
    for (const a of addresses) {
      const c = await geocode(a);
      coords.push(c);
    }

    // compute per-segment route with chosen profiles
    let totalDistanceMeters = 0;
    let totalDurationSeconds = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const rawMode = mode_of_travel[i] || 'drive';
      const profile = modeMap[rawMode.toLowerCase()] || 'driving';
      const seg = await routeSegment(coords[i], coords[i + 1], profile);
      totalDistanceMeters += seg.distance;
      totalDurationSeconds += seg.duration;
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        title,
        startLocation: start_location,
        endLocation: end_location,
        stops,
        modes: mode_of_travel,
        totalDistance: +(totalDistanceMeters / 1000).toFixed(3), // km
        totalDuration: Math.round(totalDurationSeconds / 60), // minutes
        createdBy: req.user.id
      }
    });

    res.json(itinerary);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

exports.listItineraries = async (req, res) => {
  try {
    const items = await prisma.itinerary.findMany({
      where: { createdBy: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getItinerary = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const it = await prisma.itinerary.findUnique({ where: { id } });
    if (!it) return res.status(404).json({ error: 'Not found' });
    if (it.createdBy !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    res.json(it);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

