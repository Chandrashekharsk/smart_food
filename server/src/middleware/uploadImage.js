import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


// The diskStorage option stores uploaded files directly on the server's disk, typically in a designated folder. The configuration allows specifying both the destination directory for storing files and the filename (how files should be named)
// Configure storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../uploads/"); // Directory where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
//   },
// });
const storage = multer.diskStorage({});
// File filter for images only (e.g., jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only images are allowed!")); // Reject file
  }
};
// Initialize multer with storage engine and file filter
const upload = multer({
  storage,
  // limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file size limit
  fileFilter,
});

export default upload;



// The memoryStorage option, in contrast, stores the uploaded file in memory (RAM) as a Buffer. This means that the file is only temporarily available in memory until the upload request completes, and it is not saved persistently on disk.
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });
// const upload = multer({storage});
// export default upload;










