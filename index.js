const router = require('express').Router();
const { getServices } = require('../controllers/serviceController');
const { createOrder, verifyPayment } = require('../controllers/bookingController');
const { sendMessage } = require('../controllers/contactController');

router.get('/services', getServices);
router.post('/bookings/order', createOrder);
router.post('/bookings/verify', verifyPayment);
router.post('/contact', sendMessage);

module.exports = router;
