const express = require('express');
const router = express.Router();
const { getGallery, createGallery, deleteGallery } = require('../controllers/galleryController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGallery);
router.post('/', auth, admin, upload.single('image'), createGallery);
router.delete('/:id', auth, admin, deleteGallery);

module.exports = router;