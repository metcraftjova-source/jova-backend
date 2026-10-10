import mongoose from 'mongoose';

// Fields match what the website form actually sends. The three "legacy"
// fields keep old submissions (saved before this change) readable.
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

    // legacy
    firstName: String,
    lastName: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
