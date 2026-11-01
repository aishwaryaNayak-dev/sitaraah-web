const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const { login, getDashboard, updateService } = require('../controllers/adminController');

router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), login);
router.get('/dashboard', auth, getDashboard);
router.put('/services/:id', auth, updateService);

module.exports = router;
