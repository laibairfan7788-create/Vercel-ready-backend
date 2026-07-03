const mongoose = require('mongoose');
const quoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  projectType: { type: String, required: true },
  areaSize: { type: Number, required: true },
  location: String,
  budget: String,
  message: String,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  status: { type: String, enum: ['pending','contacted','quoted','completed'], default: 'pending' },
}, { timestamps: true });
module.exports = mongoose.model('Quote', quoteSchema);