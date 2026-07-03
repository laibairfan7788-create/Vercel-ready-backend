const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGallery = async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    if (req.file) gallery.image = `/uploads/${req.file.filename}`;
    await gallery.save();
    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

