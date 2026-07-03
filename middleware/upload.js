const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Vercel's filesystem is read-only at runtime EXCEPT for /tmp, and even
// /tmp is wiped between invocations (it is not persistent storage).
// Writing to a folder under __dirname (as you would locally) will throw
// EROFS on Vercel and crash the upload route.
//
// This keeps uploads working without crashing in both environments:
//  - Locally: files are saved to ./uploads/gallery and served from there.
//  - On Vercel: files are saved to a temp folder so the request succeeds,
//    but they will NOT persist across requests or deployments.
//
// For real production use on Vercel, replace this with direct uploads to
// an external store (e.g. Cloudinary, S3, or Vercel Blob) instead of disk.
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads', 'gallery')
  : path.join(__dirname, '../uploads/gallery');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  },
});

// File filter – only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
