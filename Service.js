const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  details: [String],
  price: { type: Number, required: true },
  duration: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
