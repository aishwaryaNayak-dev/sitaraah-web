const Message = require('../models/Message');
const sendMail = require('../utils/mailer');

exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !message) {
      return res.status(400).json({ message: 'Please share your name, a valid email and a message.' });
    }
    await Message.create({ name, email, message });
    await sendMail(process.env.SMTP_USER, 'New message on the website', `${name} (${email}):\n\n${message}`);
    res.status(201).json({ message: 'Thank you, your message has reached Sitaraah.' });
  } catch (err) { next(err); }
};
