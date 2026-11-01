const Service = require('../models/Service');

const defaults = [
  { slug: 'sound-healing', title: 'Sound Healing', price: 1500, duration: '60 mins',
    summary: 'Singing bowls, vibration and guided meditation to settle your nervous system.',
    details: ['Online and offline sessions', 'Guided meditation', 'Chakra alignment'] },
  { slug: 'feminine-embodiment', title: 'Feminine Embodiment', price: 2000, duration: '90 mins',
    summary: 'Understand your body and balance the Shiv and Shakti within you.',
    details: ['Sound bowls', 'Journaling', 'Understanding the women\'s body'] },
  { slug: 'inner-child-healing', title: 'Inner Child Healing', price: 2000, duration: '90 mins',
    summary: 'Journal your inner child out and move with rhythm, music and dance.',
    details: ['Guided journaling', 'Rhythmic dancing', 'Music-led release'] },
];

exports.seedServices = async () => {
  if ((await Service.countDocuments()) === 0) await Service.insertMany(defaults);
};

exports.getServices = async (req, res, next) => {
  try {
    res.json(await Service.find().sort({ createdAt: 1 }));
  } catch (err) { next(err); }
};
