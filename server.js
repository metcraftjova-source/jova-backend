import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { connectDB } from './db.js';
import Contact from './models/Contact.js';

const app = express();
const PORT = process.env.PORT || 5001;

// TEMPORARY DEBUG — remove once SMTP is working
console.log('SMTP DEBUG:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
  passFirstChar: process.env.SMTP_PASS ? process.env.SMTP_PASS[0] : null,
  passLastChar: process.env.SMTP_PASS ? process.env.SMTP_PASS[process.env.SMTP_PASS.length - 1] : null,
});

// ---- Database ----
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

// ---- Middleware ----
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || '*', // set to your deployed frontend URL in prod
  })
);

// Basic abuse protection: max 5 submissions / 15 min / IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// ---- Mail transporter ----
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CONTACT_MAIL = process.env.CONTACT_MAIL || 'contact@jova.com';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ---- Routes ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple protected listing endpoint — pass ?key=YOUR_ADMIN_KEY
app.get('/api/contact', async (req, res) => {
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const submissions = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, data: submissions });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'First name, email, and message are required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Save the lead to MongoDB first, so we never lose it even if email sending fails
    const contactDoc = await Contact.create({ firstName, lastName, email, message });

    // Email sent TO the company inbox
    await transporter.sendMail({
      from: `"Jova Website" <${process.env.SMTP_USER}>`,
      to: CONTACT_MAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName || ''}`.trim(),
      html: `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    contactDoc.emailSent = true;
    await contactDoc.save();

    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Jova backend running on port ${PORT}`);
});