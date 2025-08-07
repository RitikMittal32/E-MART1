import mongoose from 'mongoose';

const adminMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Customer
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  issue: { type: String }, // Any specific issue reported
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
}, { timestamps: true });

const AdminMessage = mongoose.model('AdminMessage', adminMessageSchema);

export default AdminMessage;
