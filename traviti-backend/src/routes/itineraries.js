const router = require('express').Router();
const auth = require('../middleware/auth');
const { createItinerary, listItineraries, getItinerary } = require('../controllers/itineraryController');

router.post('/', auth, createItinerary);
router.get('/', auth, listItineraries);
router.get('/:id', auth, getItinerary);

module.exports = router;

