// const mongoose = require('mongoose');

// const GallerySchema = new mongoose.Schema({
//   title: { type: String },
//   image: { type: String, required: true },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Gallery', GallerySchema);


const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'Untitled',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);