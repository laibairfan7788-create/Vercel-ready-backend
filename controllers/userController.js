const User = require('../models/User');
const Order = require('../models/Order');
const Quote = require('../models/Quote');

// ─── Get user profile ────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update user profile ─────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get user orders ─────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    // If Order model doesn't exist yet, return empty array
    let orders = [];
    try {
      orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    } catch (e) {
      // Order model might not be defined – return empty
      console.warn('Order model not found, returning empty orders.');
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Create quote request (public – no auth needed) ─────────────
exports.createQuote = async (req, res) => {
  try {
    const { projectType, areaSize, location, budget, message, name, email, phone } = req.body;
    if (!projectType || !areaSize) {
      return res.status(400).json({ message: 'Project type and area size are required' });
    }

    const quoteData = {
      projectType,
      areaSize,
      location,
      budget,
      message,
      guestName: name || '',
      guestEmail: email || '',
      guestPhone: phone || '',
      status: 'pending',
    };

    // If user is logged in, attach userId
    if (req.user) {
      quoteData.userId = req.user.id;
    }

    const quote = new Quote(quoteData);
    await quote.save();
    res.status(201).json({ success: true, quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};