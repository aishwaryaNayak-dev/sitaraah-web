const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  date: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'offline'], default: 'online' },
  note: { type: String, maxlength: 500 },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
