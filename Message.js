const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
