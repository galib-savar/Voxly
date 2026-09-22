import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".mp3", ".mp4", ".mov"];

const storage = multer.memoryStorage();

/**
 * Multer file filter for media validation
 * Accepts PNG, JPG, JPEG, MP3, MP4, and MOV formats
 */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`),
    );
  }

  cb(null, true);
};

/**
 * Multer upload middleware instance
 * Configured for single/multiple image uploads with validation
 */
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
