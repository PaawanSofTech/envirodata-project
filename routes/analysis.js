const express = require('express');
const router = express.Router();
const AirQuality = require('../models/AirQuality');
const WaterQuality = require('../models/WaterQuality');

// Example: Get average AQI for Air Quality
router.get('/average-aqi', async (req, res) => {
  try {
    const data = await AirQuality.aggregate([
      { $group: { _id: null, averageAQI: { $avg: "$AQI" } } }
    ]);
    res.json(data);
  } catch (error) {
    console.error('Error fetching average AQI:', error.message);
    res.status(500).json({ message: 'Failed to fetch average AQI' });
  }
});

// Example: Get average pH for Water Quality
router.get('/average-ph', async (req, res) => {
  try {
    const data = await WaterQuality.aggregate([
      { $group: { _id: null, averagePH: { $avg: "$pH" } } }
    ]);
    res.json(data);
  } catch (error) {
    console.error('Error fetching average pH:', error.message);
    res.status(500).json({ message: 'Failed to fetch average pH' });
  }
});

module.exports = router;
