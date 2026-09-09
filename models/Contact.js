import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
