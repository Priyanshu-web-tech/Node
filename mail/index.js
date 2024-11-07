const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Configure Nodemailer transporter using Mailtrap settings
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Route to send email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Please provide to, subject, and text fields.' });
  }

  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@example.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    });

    res.status(200).json({
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
