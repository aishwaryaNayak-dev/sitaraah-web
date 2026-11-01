const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const Service = require('../models/Service');

const safeEqual = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!safeEqual(email, process.env.ADMIN_EMAIL) || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }
  res.json({ token: jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' }) });
};

exports.getDashboard = async (req, res, next) => {
  try {
    const [bookings, messages, services, paid] = await Promise.all([
      Booking.find().populate('service', 'title').sort({ createdAt: -1 }),
      Message.find().sort({ createdAt: -1 }),
      Service.find().sort({ createdAt: 1 }),
      Booking.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    ]);
    res.json({ bookings, messages, services, revenue: paid[0]?.total || 0, paidCount: paid[0]?.count || 0 });
  } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
  try {
    const { price, duration, summary } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...(price && { price: Number(price) }), ...(duration && { duration }), ...(summary && { summary }) },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (err) { next(err); }
};
