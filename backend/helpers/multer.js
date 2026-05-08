import multer from 'multer';
import path from 'path';

// Define where to store the uploaded images locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // You'll need to create a 'uploads' folder in your backend directory
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

export default upload;
