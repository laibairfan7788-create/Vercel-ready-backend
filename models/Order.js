const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ productId: mongoose.Schema.Types.ObjectId, productName: String, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','shipped','completed','cancelled'], default: 'pending' },
  shippingAddress: { street: String, city: String, state: String, zip: String, country: String },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  notes: String,
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);