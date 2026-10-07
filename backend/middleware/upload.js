const multer = require('multer');
const path = require('path');

// Storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Yeh 'uploads' folder me images save karega
  },
  filename: (req, file, cb) => {
    // Unique filename banane ke liye current timestamp jodh rahe hain
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;