import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { connectDB } from './db.js';
import mongoose from 'mongoose';

// ---- Gmail raw-message builder (supports an attachment + non-ASCII text) ----
const CRLF = '\r\n';
const b64 = (data) => Buffer.from(data).toString('base64');
const wrap76 = (s) => (s.match(/.{1,76}/g) || ['']).join(CRLF);
const oneLine = (s) => String(s || '').replace(/[\r\n]+/g, ' ').trim();
const encodeHeader = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);

const MIME = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  dwg: 'application/acad',
  dxf: 'application/dxf',
};

const buildRawMessage = ({ from, to, replyTo, subject, html, attachment }) => {
  const boundary = `jova_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

  const lines = [
    `From: ${oneLine(from)}`,
    `To: ${oneLine(to)}`,
    replyTo ? `Reply-To: ${oneLine(replyTo)}` : null,
    `Subject: ${encodeHeader(oneLine(subject))}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(b64(html)),
  ].filter((l) => l !== null);

  if (attachment?.buffer?.length) {
    const safeName = oneLine(attachment.filename).replace(/[^\w.\- ]/g, '_') || 'drawing';
    const ext = safeName.split('.').pop().toLowerCase();
    lines.push(
      `--${boundary}`,
      `Content-Type: ${MIME[ext] || 'application/octet-stream'}; name="${safeName}"`,
      `Content-Disposition: attachment; filename="${safeName}"`,
      'Content-Transfer-Encoding: base64',
      '',
      wrap76(b64(attachment.buffer))
    );
  }
  lines.push(`--${boundary}--`, '');

  return Buffer.from(lines.join(CRLF))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// ---- Contact model (defined here so no separate model file is needed) ----
const contactSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: { type: String, required: true },
    phone: String,
    requirement: String,
    drawingName: String,
    drawingSize: Number,
    emailSent: { type: Boolean, default: false },
    // legacy fields keep older submissions readable
    firstName: String,
    lastName: String,
    message: String,
  },
  { timestamps: true }
);
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// ---- Visit model: anonymous page-view ping (no IP, no cookies) ----
// Auto-deleted after 180 days by the TTL index on createdAt.
const visitSchema = new mongoose.Schema({
  path: String,
  referrer: String,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 180 },
});
const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;

// ---- Database ----
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

// ---- Middleware ----
app.use(express.json());

// CORS allow-list: FRONTEND_ORIGIN (with and without www) + localhost for dev.
// On Render set FRONTEND_ORIGIN=https://jovametcraft.com
const configuredOrigin = process.env.FRONTEND_ORIGIN || '';
const allowedOrigins = new Set(
  [
    configuredOrigin,
    configuredOrigin.replace('://www.', '://'),
    configuredOrigin.includes('://www.') ? '' : configuredOrigin.replace('://', '://www.'),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header (curl, server-to-server) -> nothing to check.
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      console.warn('CORS blocked request from origin:', origin);
      // Deny quietly (no thrown error, so the server doesn't answer with a 500).
      return callback(null, false);
    },
  })
);

// Max 5 submissions / 15 min / IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Visit pings: max 60 / 15 min / IP (silent - the site never shows an error for this)
const visitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.sendStatus(204),
});

// The form sends multipart/form-data (text fields + optional drawing file).
const MAX_FILE_MB = 10;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ok = /\.(pdf|png|jpe?g|dwg|dxf)$/i.test(file.originalname || '');
    cb(ok ? null : new Error('UNSUPPORTED_FILE'), ok);
  },
});
const parseForm = (req, res, next) =>
  upload.single('drawing')(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `The drawing is too large. Maximum size is ${MAX_FILE_MB} MB.`
        : err.message === 'UNSUPPORTED_FILE'
          ? 'Unsupported file type. Please upload PDF, PNG, JPG, DWG or DXF.'
          : 'Could not read the form. Please try again.';
    return res.status(400).json({ success: false, message });
  });

// ---- Gmail API (HTTPS, no SMTP - Render blocks SMTP ports) ----
// Uses the small google-auth-library package to get an access token, then calls
// Gmail's REST endpoint directly. (The huge "googleapis" package is not needed.)
const OAUTH_PLAYGROUND_REDIRECT = 'https://developers.google.com/oauthplayground';
const oauth2Client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  OAUTH_PLAYGROUND_REDIRECT
);
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const sendGmail = async ({ to, replyTo, subject, html, attachment }) => {
  const raw = buildRawMessage({
    from: `Jova Website <${process.env.GMAIL_USER}>`,
    to,
    replyTo,
    subject,
    html,
    attachment,
  });
  const { token } = await oauth2Client.getAccessToken();
  const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  if (!resp.ok) {
    throw new Error(`Gmail API ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }
};

const CONTACT_MAIL = process.env.CONTACT_MAIL || process.env.GMAIL_USER;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

// ---- Routes ----
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Anonymous visit ping from the frontend (see ScrollToTop in the frontend App.jsx)
app.post('/api/visit', visitLimiter, async (req, res) => {
  try {
    const body = req.body || {};
    await Visit.create({
      path: clean(body.path, 200),
      referrer: clean(body.referrer, 300),
    });
  } catch (err) {
    console.error('Visit ping failed:', err.message);
  }
  return res.sendStatus(204);
});

// Protected listing endpoint - pass ?key=YOUR_ADMIN_KEY
app.get('/api/contact', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const submissions = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, data: submissions });
});

app.post('/api/contact', contactLimiter, parseForm, async (req, res) => {
  try {
    const body = req.body || {};
    const name = clean(body.name, 120);
    const company = clean(body.company, 160);
    const email = clean(body.email, 200);
    const phone = clean(body.phone, 40);
    const requirement = String(body.requirement ?? '').trim().slice(0, 5000);
    const file = req.file;

    if (!name || !email || !requirement) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and project requirement are required.',
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Save the lead first, so it is never lost even if the email fails
    const contactDoc = await Contact.create({
      name,
      company,
      email,
      phone,
      requirement,
      drawingName: file?.originalname,
      drawingSize: file?.size,
    });

    try {
      await sendGmail({
        to: CONTACT_MAIL,
        replyTo: email,
        subject: `New enquiry from ${name}${company ? ` (${company})` : ''}`,
        attachment: file ? { filename: file.originalname, buffer: file.buffer } : null,
        html: `
          <h2>New Website Enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || '-')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || '-')}</p>
          <p><strong>Drawing:</strong> ${file ? escapeHtml(file.originalname) + ' (attached)' : 'none'}</p>
          <p><strong>Project / requirement:</strong></p>
          <p>${escapeHtml(requirement).replace(/\n/g, '<br/>')}</p>
        `,
      });
      contactDoc.emailSent = true;
      await contactDoc.save();
    } catch (mailErr) {
      // The lead is safely stored (emailSent stays false) - don't tell the visitor it failed.
      console.error('Lead saved but email failed:', mailErr.message);
    }

    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Jova backend running on port ${PORT}`);
});
