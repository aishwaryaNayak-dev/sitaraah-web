const crypto = require('crypto');
const Razorpay = require('razorpay');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const sendMail = require('../utils/mailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { serviceId, name, email, date, mode, note } = req.body;
    if (!serviceId || !name || !/^\S+@\S+\.\S+$/.test(email || '') || !date || new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Please fill in every field with a valid future date.' });
    }
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    const order = await razorpay.orders.create({
      amount: service.price * 100,
      currency: 'INR',
      receipt: `sit_${Date.now()}`,
    });
    await Booking.create({
      service: service._id, name, email, date, mode, note,
      amount: service.price, razorpayOrderId: order.id,
    });
    res.status(201).json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (expected !== razorpay_signature) {
      booking.status = 'failed';
      await booking.save();
      return res.status(400).json({ message: 'Payment could not be verified.' });
    }
    booking.status = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();
    const service = await Service.findById(booking.service);
    const when = new Date(booking.date).toLocaleString('en-IN');
    await sendMail(booking.email, 'Your Sitaraah session is booked',
      `Hi ${booking.name},\n\nYour ${service.title} session (${booking.mode}) is confirmed for ${when}.\nAmount paid: Rs ${booking.amount}\n\nWith love,\nSitaraah Wellness`);
    await sendMail(process.env.SMTP_USER, 'New booking',
      `${booking.name} (${booking.email}) booked ${service.title}, ${booking.mode}, on ${when}.`);
    res.json({ message: 'Your session is booked. A confirmation email is on its way.' });
  } catch (err) { next(err); }
};
