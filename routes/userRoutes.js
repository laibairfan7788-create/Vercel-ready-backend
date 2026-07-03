const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getProfile, updateProfile, getOrders, createQuote } = require('../controllers/userController');

// Protected routes (require login)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/orders', auth, getOrders);

// Public route (no auth needed)
router.post('/quote', createQuote);

module.exports = router;