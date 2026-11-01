require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');
const routes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/admin');
const { seedServices } = require('./controllers/serviceController');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '10kb' }));
let seeded = false;
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!seeded) { await seedServices(); seeded = true; }
    next();
  } catch (err) { next(err); }
});

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use('/api/admin', adminRoutes);
app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../client/dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: 'Something went wrong. Please try again.' });
});

if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 5000, () => console.log('Server running'));
}

module.exports = app;
