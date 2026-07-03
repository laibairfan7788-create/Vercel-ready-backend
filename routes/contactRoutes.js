const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { auth, admin } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', auth, admin, getContacts);
router.put('/:id', auth, admin, updateContactStatus);

module.exports = router;