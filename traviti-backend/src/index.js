require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itineraries');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // frontend default Vite port
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/itineraries', itineraryRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Traviti backend listening at http://localhost:${port}`);
});


app.get("/", (req, res) => {
  res.send("Traviti backend is working ✅");
});
