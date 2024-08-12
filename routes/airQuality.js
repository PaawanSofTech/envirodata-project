const express = require('express');
const router = express.Router();  // Define the router

const AirQuality = require('../models/AirQuality');

// Get air quality data with optional date range
router.get('/', async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;
  const query = {};
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  if (startDate && endDate) {
    query.Date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const data = await AirQuality.find(query).skip((options.page - 1) * options.limit).limit(options.limit);
    res.json(data);
  } catch (error) {
    console.error('Error fetching air quality data:', error.message);
    res.status(500).json({ message: 'Failed to fetch air quality data' });
  }
});

module.exports = router;  // Export the router
