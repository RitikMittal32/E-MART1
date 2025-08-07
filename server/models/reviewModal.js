import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  messageThread: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread' }, // New Field
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
