const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
  pH: Number,
  Hardness: Number,
  Solids: Number,
  Chloramines: Number,
  Sulfate: Number,
  Conductivity: Number,
  Organic_carbon: Number,
  Trihalomethanes: Number,
  Turbidity: Number,
  Potability: Number
});

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
