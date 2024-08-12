const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  City: String,
  Date: Date,
  PM2_5: Number,
  PM10: Number,
  NO: Number,
  NO2: Number,
  NOx: Number,
  NH3: Number,
  CO: Number,
  SO2: Number,
  O3: Number,
  Benzene: Number,
  Toluene: Number,
  Xylene: Number,
  AQI: Number,
  AQI_Bucket: String
});

module.exports = mongoose.model('AirQuality', airQualitySchema);
