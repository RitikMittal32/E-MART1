import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const messageThreadSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true, unique: true },
  product: {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    name: { type: String, required: true },
  },
  messages: [messageSchema],
}, { timestamps: true });

const MessageThread = mongoose.model('MessageThread', messageThreadSchema);

export default MessageThread;
