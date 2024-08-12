const express = require('express');
const router = express.Router();
const WaterQuality = require('../models/WaterQuality');

router.get('/', async (req, res) => {
  try {
    const waterQualityData = await WaterQuality.find();
    res.json(waterQualityData);
  } catch (error) {
    console.error('Error fetching water quality data:', error.message);
    res.status(500).json({ message: 'Failed to fetch water quality data' });
  }
});

module.exports = router;
