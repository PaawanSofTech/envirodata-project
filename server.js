const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const AirQuality = require('./models/AirQuality');
const WaterQuality = require('./models/WaterQuality');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Utility function to clean and convert data
const cleanAndConvertData = (row, schema) => {
  Object.keys(row).forEach(key => {
    if (row[key] === '' || row[key] === null) {
      row[key] = null; // Convert empty strings and null to null
    }
  });

  // Convert fields to appropriate types
  if (schema === 'AirQuality') {
    if (row.Date) row.Date = new Date(row.Date);
    ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene', 'AQI'].forEach(field => {
      if (row[field]) row[field] = parseFloat(row[field]);
    });
  } else if (schema === 'WaterQuality') {
    ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity'].forEach(field => {
      if (row[field]) row[field] = parseFloat(row[field]);
    });
    row.Potability = parseInt(row.Potability);
  }

  return row;
};

// Load Air Quality Data
fs.createReadStream('./data/air_quality.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const cleanedRow = cleanAndConvertData(row, 'AirQuality');

    try {
      const airQualityEntry = new AirQuality(cleanedRow);
      await airQualityEntry.save();
      // console.log('Air Quality data saved');
    } catch (err) {
      console.error('Error saving air quality data:', err.message);
    }
  })
  .on('end', () => {
    console.log('Air Quality CSV file processing complete');
  });

// Load Water Quality Data
fs.createReadStream('./data/water_quality.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const cleanedRow = cleanAndConvertData(row, 'WaterQuality');

    try {
      const waterQualityEntry = new WaterQuality(cleanedRow);
      await waterQualityEntry.save();
      // console.log('Water Quality data saved');
    } catch (err) {
      console.error('Error saving water quality data:', err.message);
    }
  })
  .on('end', () => {
    console.log('Water Quality CSV file processing complete');
  });

// Import Routes
const airQualityRoutes = require('./routes/airQuality');
const waterQualityRoutes = require('./routes/waterQuality');

// Use Routes
app.use('/api/airquality', airQualityRoutes);
app.use('/api/waterquality', waterQualityRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
