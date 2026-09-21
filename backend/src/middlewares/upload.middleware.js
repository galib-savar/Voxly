import fs from "fs";
import multer from "multer";
import path from "path";

// Configuration constants
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".mp3", ".mp4", ".mov"];

/**
 * Initialize uploads directory (cross-platform)
 * Creates the directory if it doesn't exist
 */
const initializeUploadsDir = () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("[Multer] Failed to initialize uploads directory:", {
      path: UPLOADS_DIR,
      error: err.message,
    });
    // Warn but don't throw - multer will handle via callback
  }
};

initializeUploadsDir();

/**
 * Multer storage configuration using disk storage
 * Stores files with timestamp-based naming for uniqueness
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    cb(null, filename);
  },
});

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
